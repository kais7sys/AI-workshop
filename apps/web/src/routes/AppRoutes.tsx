import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell.js';
import { ProtectedRoute } from '../components/layout/ProtectedRoute.js';

// Public Pages
import { LandingPage } from '../pages/public/LandingPage.js';
import { LoginPage } from '../pages/public/LoginPage.js';
import { RegisterPage } from '../pages/public/RegisterPage.js';
import { ForgotPasswordPage } from '../pages/public/ForgotPasswordPage.js';

// Farmer Pages
import { DashboardPage } from '../pages/farmer/DashboardPage.js';
import { ProfilePage } from '../pages/farmer/ProfilePage.js';
import { FarmsPage } from '../pages/farmer/FarmsPage.js';
import { NewFarmPage } from '../pages/farmer/NewFarmPage.js';
import { FarmDetailsPage } from '../pages/farmer/FarmDetailsPage.js';
import { AdvisoryPage } from '../pages/farmer/AdvisoryPage.js';
import { AdvisoryHistoryPage } from '../pages/farmer/AdvisoryHistoryPage.js';
import { ChatPage } from '../pages/farmer/ChatPage.js';
import { DiseaseAssistantPage } from '../pages/farmer/DiseaseAssistantPage.js';
import { SchemesPage } from '../pages/farmer/SchemesPage.js';
import { SchemeDetailsPage } from '../pages/farmer/SchemeDetailsPage.js';
import { AlertsPage } from '../pages/farmer/AlertsPage.js';
import { CasesPage } from '../pages/farmer/CasesPage.js';
import { NewCasePage } from '../pages/farmer/NewCasePage.js';
import { CaseDetailsPage } from '../pages/farmer/CaseDetailsPage.js';
import { NotificationsPage } from '../pages/farmer/NotificationsPage.js';

// Officer Pages
import { OfficerDashboardPage } from '../pages/officer/OfficerDashboardPage.js';
import { OfficerCasesPage } from '../pages/officer/OfficerCasesPage.js';
import { OfficerCaseDetailsPage } from '../pages/officer/OfficerCaseDetailsPage.js';
import { OfficerFarmersPage } from '../pages/officer/OfficerFarmersPage.js';
import { OfficerFarmerDetailsPage } from '../pages/officer/OfficerFarmerDetailsPage.js';
import { OfficerAdvisoriesPage } from '../pages/officer/OfficerAdvisoriesPage.js';
import { OfficerAlertsPage } from '../pages/officer/OfficerAlertsPage.js';
import { OfficerContentPage } from '../pages/officer/OfficerContentPage.js';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage.js';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage.js';
import { AdminOfficersPage } from '../pages/admin/AdminOfficersPage.js';
import { AdminCropsPage } from '../pages/admin/AdminCropsPage.js';
import { AdminSchemesPage } from '../pages/admin/AdminSchemesPage.js';
import { AdminAuditLogsPage } from '../pages/admin/AdminAuditLogsPage.js';
import { AdminSystemPage } from '../pages/admin/AdminSystemPage.js';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Authenticated Application Shell */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        {/* Farmer Domain Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/farms" element={<FarmsPage />} />
        <Route path="/farms/new" element={<NewFarmPage />} />
        <Route path="/farms/:id" element={<FarmDetailsPage />} />
        <Route path="/advisory" element={<AdvisoryPage />} />
        <Route path="/advisory/history" element={<AdvisoryHistoryPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/disease-assistant" element={<DiseaseAssistantPage />} />
        <Route path="/schemes" element={<SchemesPage />} />
        <Route path="/schemes/:id" element={<SchemeDetailsPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/cases/new" element={<NewCasePage />} />
        <Route path="/cases/:id" element={<CaseDetailsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />

        {/* Officer Domain Routes */}
        <Route
          path="/officer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['OFFICER', 'ADMIN']}>
              <OfficerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer/cases"
          element={
            <ProtectedRoute allowedRoles={['OFFICER', 'ADMIN']}>
              <OfficerCasesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer/cases/:id"
          element={
            <ProtectedRoute allowedRoles={['OFFICER', 'ADMIN']}>
              <OfficerCaseDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer/farmers"
          element={
            <ProtectedRoute allowedRoles={['OFFICER', 'ADMIN']}>
              <OfficerFarmersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer/farmers/:id"
          element={
            <ProtectedRoute allowedRoles={['OFFICER', 'ADMIN']}>
              <OfficerFarmerDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer/advisories"
          element={
            <ProtectedRoute allowedRoles={['OFFICER', 'ADMIN']}>
              <OfficerAdvisoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer/alerts"
          element={
            <ProtectedRoute allowedRoles={['OFFICER', 'ADMIN']}>
              <OfficerAlertsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer/content"
          element={
            <ProtectedRoute allowedRoles={['OFFICER', 'ADMIN']}>
              <OfficerContentPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Domain Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/officers"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminOfficersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/crops"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminCropsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/schemes"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminSchemesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/alerts"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <OfficerAlertsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/advisories"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <OfficerAdvisoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminAuditLogsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/system"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminSystemPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
