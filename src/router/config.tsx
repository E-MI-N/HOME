import type { RouteObject } from 'react-router-dom';
import Layout from '../components/feature/Layout';
import HomePage from '../pages/home/page';
import ProfilePage from '../pages/profile/page';
import GalleryPage from '../pages/gallery/page';
import ArchivePage from '../pages/archive/page';
import TrpgPage from '../pages/trpg/page';
import AdminPage from '../pages/admin/page';
import AdminLoginPage from '../pages/admin/login/page';
import NotFound from '../pages/NotFound';

const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/gallery', element: <GalleryPage /> },
      { path: '/archive', element: <ArchivePage /> },
      { path: '/trpg', element: <TrpgPage /> },
    ],
  },
  { path: '/admin', element: <AdminPage /> },
  { path: '/admin/login', element: <AdminLoginPage /> },
  { path: '*', element: <NotFound /> },
];

export default routes;
