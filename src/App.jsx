import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './routes/AdminRoute';
import PublicRoute from './routes/PublicRoute';
import AdminLayout from './components/layout/AdminLayout';

// Pages
import AdminLogin from './pages/auth/AdminLogin';
import Dashboard from './pages/Dashboard';
import Banners from './pages/Banners';
import Users from './pages/Users';
import Countries from './pages/Countries';
import Networks from './pages/Networks';
import FeeConfigs from './pages/FeeConfigs';
import Aggregators from './pages/Aggregators';
import Transactions from './pages/Transactions';
import UserTransactions from './pages/UserTransactions';
import TransactionDetails from './pages/TransactionDetails';
import KYC from './pages/KYC';
import KYCDetails from './pages/KYCDetails';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="banners" element={<Banners />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:userId/transactions" element={<UserTransactions />} />
            {/* <Route path="countries" element={<Countries />} /> */}
            <Route path="networks" element={<Networks />} />
            {/* <Route path="fee-configs" element={<FeeConfigs />} /> */}
            <Route path="aggregators" element={<Aggregators />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="transactions/:txnId" element={<TransactionDetails />} />
            <Route path="kyc" element={<KYC />} />
            <Route path="kyc/:kycUid" element={<KYCDetails />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
