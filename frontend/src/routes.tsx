import App from './ui/App'
import Home from './ui/pages/Home'
import Login from './ui/pages/auth/Login'
import Register from './ui/pages/auth/Register'
import Forgot from './ui/pages/auth/Forgot'
import Reset from './ui/pages/auth/Reset'
import Profile from './ui/pages/Profile'
import Templates from './ui/pages/Templates'
import Editor from './ui/pages/Editor'
import MyPorts from './ui/pages/MyPorts'
import ReportIssue from './ui/pages/ReportIssue'
import PackagesPage from './ui/pages/Packages'
import Checkout from './ui/pages/Checkout'
import PaymentReview from './ui/pages/PaymentReview'
import AdminUsers from './ui/pages/admin/AdminUsers'
import AdminTemplates from './ui/pages/admin/AdminTemplates'
import AdminIssues from './ui/pages/admin/AdminIssues'
import AdminPayments from './ui/pages/admin/AdminPayments'
import AdminPackages from './ui/pages/admin/AdminPackages'
import AdminProfile from './ui/pages/admin/AdminProfile'
import AdminEditor from './ui/pages/admin/AdminEditor'
import TemplateDetail from './ui/pages/admin/TemplateDetail'
import { RouteObject, Navigate } from 'react-router-dom'
import AdminLayout from './ui/pages/admin/AdminLayout'
import UserLayout from './ui/pages/UserLayout'
import ViewPortfolio from './ui/pages/ViewPortfolio';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
          { path: 'forgot', element: <Forgot /> },
          { path: 'reset-password', element: <Reset /> },
      {
        element: <UserLayout />,
        children: [
          { index: true, element: <Home /> }, 
          { path: 'profile', element: <Profile /> },
          { path: 'templates', element: <Templates /> },
          { path: 'editor', element: <Editor /> },
          { path: 'my-ports', element: <MyPorts /> },
          { path: 'report', element: <ReportIssue /> },
          { path: 'packages', element: <PackagesPage /> },
          { path: 'checkout', element: <Checkout /> },
          { path: 'payment-review', element: <PaymentReview /> },
          { path: 'view/:id', element: <ViewPortfolio /> },
        ]
      },
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="users" replace /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'templates', element: <AdminTemplates /> },
          { path: 'templates/:id', element: <TemplateDetail /> },
          { path: 'profile', element: <AdminProfile /> },
          { path: 'editor', element: <AdminEditor /> },
          { path: 'issues', element: <AdminIssues /> },
          { path: 'payments', element: <AdminPayments /> },
          { path: 'packages', element: <AdminPackages /> }
        ]
      }
    ]
  }
]

export default routes