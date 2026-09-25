import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  HelpCircle,
  Plus,
  Trash2,
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { ChatSession, ChatMessage } from '../../types/index.js';

export const ChatPage: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'Why are the lower leaves of my wheat turning yellow?',
    'What is the ideal irrigation schedule during a heatwave?',
    'Which government subsidy applies for installing drip irrigation?',
    'How can I improve soil organic carbon naturally?',
  ];

  useEffect(() => {
    async function loadSessions() {
      try {
        const data = await api.get<ChatSession[]>('/api/chat/sessions');
        setSessions(data);
        if (data.length > 0) {
          setActiveSessionId(data[0].id);
        } else {
          // Create initial session
          const newSession = await api.post<ChatSession>('/api/chat/sessions', {
            title: 'General Agricultural Consultation',
          });
          setSessions([newSession]);
          setActiveSessionId(newSession.id);
        }
      } catch (err) {
        console.error('Failed to load chat sessions', err);
      }
    }
    loadSessions();
  }, []);

  useEffect(() => {
    async function loadMessages() {
      if (!activeSessionId) return;
      try {
        const data = await api.get<{ session: ChatSession; messages: ChatMessage[] }>(
          `/api/chat/sessions/${activeSessionId}`
        );
        setMessages(data.messages);
      } catch (err) {
        console.error('Failed to load messages', err);
      }
    }
    loadMessages();
  }, [activeSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSendMessage = async (contentToSend?: string) => {
    const text = contentToSend || inputPrompt;
    if (!text.trim() || !activeSessionId || isSending) return;

    setInputPrompt('');
    setIsSending(true);

    // Optimistically add user message
    const tempUserMsg: ChatMessage = {
      id: crypto.randomUUID(),
      session_id: activeSessionId,
      role: 'USER',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await api.post<{ message: ChatMessage }>(
        `/api/chat/sessions/${activeSessionId}/messages`,
        { content: text }
      );
      setMessages((prev) => [...prev, res.message]);
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateNewSession = async () => {
    try {
      const newSession = await api.post<ChatSession>('/api/chat/sessions', {
        title: `Consultation ${sessions.length + 1}`,
      });
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
      setMessages([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-4">
      {/* Sessions Sidebar */}
      <div className="hidden md:flex flex-col w-64 glass-card p-4 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Consultations
          </span>
          <button
            onClick={handleCreateNewSession}
            className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
            title="New Chat Session"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSessionId(s.id)}
              className={`w-full text-left p-2.5 rounded-xl text-xs font-medium truncate transition-colors flex items-center gap-2 ${
                activeSessionId === s.id
                  ? 'bg-agri-600 text-white font-bold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{s.title || 'Agronomic Session'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 glass-card flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-900 shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">KrishiSeva AI Agronomist</h3>
              <p className="text-[11px] text-emerald-600 font-medium">Context-aware agricultural advisor</p>
            </div>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12 space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">How can I assist your farm today?</h4>
              <p className="text-xs text-slate-500">
                Ask any question regarding crop growth stages, pest prevention, soil health, fertilizer scheduling, or agricultural schemes.
              </p>
              <div className="grid grid-cols-1 gap-2 pt-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 text-left transition-all"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => {
            const isUser = m.role === 'USER';
            const meta = m.metadata || {};

            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-agri-600 text-white'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2.5 ${
                    isUser
                      ? 'bg-agri-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>

                  {/* Structured key points from AI */}
                  {meta.keyPoints && meta.keyPoints.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <span className="font-bold text-[11px] text-slate-500 uppercase tracking-wider block">
                        Key Agronomic Takeaways:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
                        {meta.keyPoints.map((pt: string, i: number) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Follow-up suggestion questions */}
                  {meta.followUpQuestions && meta.followUpQuestions.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {meta.followUpQuestions.map((fq: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(fq)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-medium transition-colors"
                        >
                          {fq}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex gap-3 max-w-3xl">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1">Synthesizing agronomic response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask about crops, symptoms, soil nutrition, irrigation timing..."
              className="flex-1 input-field text-xs sm:text-sm py-3"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isSending}
              className="btn-primary py-3 px-5 text-xs font-bold flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
