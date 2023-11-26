import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import RegisterPage from './pages/RegisterPage';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import UserDashboardAppPage from './pages/user/DashboardAppPage';
import Loading from './components/loading/Loading';

// ----------------------------------------------------------------------

export default function Router() {
  const {currentUser, loading, userData} =useContext(AuthContext)
  

  const ProtectedRoute = ({children, requiredRole}) => {
    const [timedOut, setTimedOut] = useState(false);
  
    useEffect(() => {
      // Set a timeout to consider the loading taking too long
      const timeoutId = setTimeout(() => {
        setTimedOut(true);
      }, 2000); // 5 seconds timeout (adjust as needed)
  
      return () => {
        clearTimeout(timeoutId);
      };
    }, []);
  
    if (loading) {
      if (timedOut) {
        // Redirect to login page if loading takes too long
        return <Navigate to="/login" replace />;
      } else {
        return <Loading/>
      }
    }
    if(!currentUser) {
      return <Navigate to='/login'/>
    }
    if (requiredRole && userData.role !== requiredRole) {
      if (userData.role === "Admin") {
        return <Navigate to="/dashboard" />;
      } else {
        return <Navigate to="/client" />;
      }
   // Redirect to an unauthorized page or handle as needed
    }
    return children
  }
  const routes = useRoutes([
    {
      path: '/',
      element:<Navigate to="/login" replace /> ,
    },
    {
      path: 'login',
      element:  <LoginPage />,
    },
    {
      path: 'register',
      element: <RegisterPage />,
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <ProtectedRoute requiredRole="Admin"><Navigate to="/dashboard/app" /></ProtectedRoute>, index: true },
        { path: 'app', element: <ProtectedRoute requiredRole="Admin"><DashboardAppPage /></ProtectedRoute> },
        { path: 'user', element: <ProtectedRoute requiredRole="Admin"><UserPage /></ProtectedRoute> },
        { path: 'products', element: <ProtectedRoute requiredRole="Admin"><ProductsPage /></ProtectedRoute> },
        { path: 'blog', element: <ProtectedRoute requiredRole="Admin"><BlogPage /> </ProtectedRoute>},
      ],
    },
    {
      path: '/client',
      element: <DashboardLayout />,
      children: [
        { element: <ProtectedRoute ><Navigate to="/client/userApp" /></ProtectedRoute>, index: true },
        { path: 'userApp', element: <ProtectedRoute ><UserDashboardAppPage /></ProtectedRoute> },
      ]
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
