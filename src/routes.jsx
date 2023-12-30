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

import Loading from './components/loading/Loading';
import CertificatesPage from './pages/user/CertificatesPage';
import RequestBaptismal from './pages/user/RequestBaptismal';
import RequestMarriage from './pages/user/RequestMarriage';
import AdminCertPage from './pages/AdminCertPage';
import ViewBaptismal from './pages/user/ViewBaptismal';
import ViewMarriage from './pages/user/ViewMarriage';
import DonationPage from './pages/DonationPage';
import EventPage from './pages/EventPage';
import UserEventPage from './pages/user/UserEventPage';
import RsvpPage from './pages/RsvpPage';
import UserDashboardAppPage from './pages/user/UserDashboardAppPage';
import MemberPage from './pages/MemberPage';


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
        { path: 'user/view/:id', element: <ProtectedRoute requiredRole="Admin"><MemberPage /></ProtectedRoute> },
        { path: 'products', element: <ProtectedRoute requiredRole="Admin"><ProductsPage /></ProtectedRoute> },
        { path: 'blog', element: <ProtectedRoute requiredRole="Admin"><BlogPage /> </ProtectedRoute>},
        { path: 'donation', element: <ProtectedRoute requiredRole="Admin"><DonationPage /> </ProtectedRoute>},
        { path: 'event', element: <ProtectedRoute requiredRole="Admin"><EventPage /> </ProtectedRoute>},
        { path: 'event/view/:id', element: <ProtectedRoute requiredRole="Admin"><RsvpPage /> </ProtectedRoute>},
        { path: 'certificates', element: <ProtectedRoute requiredRole="Admin"><AdminCertPage /> </ProtectedRoute>},
      ],
    },
    {
      path: '/client',
      element: <DashboardLayout />,
      children: [
        { element: <ProtectedRoute ><Navigate to="/client/userApp" /></ProtectedRoute>, index: true },
        { path: 'userApp', element: <ProtectedRoute ><UserDashboardAppPage /></ProtectedRoute> },
        { path: 'events', element: <ProtectedRoute ><UserEventPage /></ProtectedRoute> },
        { path: 'baptismal', element: <ProtectedRoute ><RequestBaptismal /></ProtectedRoute> },
        { path: 'marriage', element: <ProtectedRoute ><RequestMarriage /></ProtectedRoute> },
        { path: 'certificates', element: <ProtectedRoute ><CertificatesPage /></ProtectedRoute> },
        { path: 'certificates/baptismal/:id', element: <ProtectedRoute ><ViewBaptismal /></ProtectedRoute> },
        { path: 'certificates/marriage/:id', element: <ProtectedRoute ><ViewMarriage /></ProtectedRoute> },
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
