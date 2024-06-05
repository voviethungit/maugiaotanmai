import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './adminv2/layouts/dashboard';
import SimpleLayout from './adminv2/layouts/simple';
//
import BlogPage from './adminv2/pages/BlogPage';
import UserPage from './adminv2/pages/UserPage';
import LoginPage from './adminv2/pages/LoginPage';
import Page404 from './adminv2/pages/Page404';
import ProductsPage from './adminv2/pages/ProductsPage';
import DashboardAppPage from './adminv2/pages/DashboardAppPage';
import  Category from './adminv2/pages/Category';
import RentalPage from './adminv2/pages/RentalPage'
import CustomerPage from './adminv2/pages/CustomerPage';
import ReviewPage from './adminv2/pages/ReviewPage';
import VerifyPage from './adminv2/pages/VerifyPage';
// ----------------------------------------------------------------------

export default function Router() {
  const isAdmin = localStorage.getItem('isAdmin');
  
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'category', element: <Category /> },
        { path: 'rental', element: <RentalPage /> },
        { path: 'customer', element: <CustomerPage /> },
        { path: 'review', element: <ReviewPage /> },
        { path: 'verify', element: <VerifyPage /> },
      ],
    },
    {
      path: 'login-admin',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
  
  return routes;
}
