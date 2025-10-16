import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layouts/MainLayout';
import { AuthLayout } from '../components/layouts/AuthLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import ProjectDetail from '../pages/ProjectDetail';
import SessionDetail from '../pages/SessionDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'projects/:projectId',
        element: <ProjectDetail />,
      },
      {
        path: 'sessions/:sessionId',
        element: <SessionDetail />,
      },
    ],
  },
]);
