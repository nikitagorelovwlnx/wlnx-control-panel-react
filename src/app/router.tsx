import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@/shared/components/layout';
import { DashboardPage } from './pages/dashboard-page';
import { PromptsPage } from './pages/prompts-page';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <DashboardPage />
      </Layout>
    ),
  },
  {
    path: '/prompts',
    element: (
      <Layout>
        <PromptsPage />
      </Layout>
    ),
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
