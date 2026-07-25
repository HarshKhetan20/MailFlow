import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <div style={{ padding: '2rem', textAlign: 'center' }}>Login Page Placeholder</div>,
  },
  {
    path: '/oauth/callback',
    element: <div style={{ padding: '2rem', textAlign: 'center' }}>OAuth Callback Processing...</div>,
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
