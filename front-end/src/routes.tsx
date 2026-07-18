import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicRoute } from '@/components/PublicRoute';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { Dashboard } from '@/pages/Dashboard';
import { WhatsAppHub } from '@/pages/WhatsAppHub';
import { Contacts } from '@/pages/Contacts';
import { OcrReader } from '@/pages/OcrReader';
import { DraftsStudio } from '@/pages/DraftsStudio';
import { BroadcastQueue } from '@/pages/BroadcastQueue';
import { Profile } from '@/pages/Profile';
import { SettingsPage } from '@/pages/SettingsPage';
import { HelpCenterPage } from '@/pages/HelpCenterPage';
import { NotFound } from '@/pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <PublicRoute>
        <ForgotPassword />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '', element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'whatsapp', element: <WhatsAppHub /> },
      { path: 'contacts', element: <Contacts /> },
      { path: 'ocr', element: <OcrReader /> },
      { path: 'drafts', element: <DraftsStudio /> },
      { path: 'broadcast', element: <BroadcastQueue /> },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'help', element: <HelpCenterPage /> },
      /* Stubs removidos da navegação — redirecionam para o painel */
      { path: 'audit', element: <Navigate to="/dashboard" replace /> },
      { path: 'telemetry', element: <Navigate to="/dashboard" replace /> },
      { path: 'api-keys', element: <Navigate to="/dashboard" replace /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
