
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Customers from "./Components/ProtectedRoutes/Customers/Customers";
import Products from "./Components/ProtectedRoutes/Products/Products";
import Sales from "./Components/ProtectedRoutes/Sales/Sales";
import CreditNote from "./Components/ProtectedRoutes/CreditNote/CreditNote";
import Users from "./Components/ProtectedRoutes/Users/Users";
import ERPIntegration from "./Components/ProtectedRoutes/ERP/ERPIntegeration";
import About from "./Components/ProtectedRoutes/About/About";
import MainDashboard from "./Components/ProtectedRoutes/MainDashboard/MainDashboard";
import Login from "./Components/Auth/Login";
import NotFound from "./Components/Auth/NotFound";
import ProtectedRoutes from "./Components/ProtectedRoutes/ProtectedRoutes";
import Signup from "./Components/Auth/Signup";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import ResetPassword from "./Components/Auth/ResetPassword";
import ChangePassword from "./Components/Auth/ChangePassword";
import { useSession } from "./customhooks/useSession";
export default function App() {
  useSession()
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path={`/signup/${import.meta.env.VITE_SECRET_SIGNUP_KEY }`} element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<MainDashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/creditnote" element={<CreditNote />} />
          <Route path="/users" element={<Users />} />
          <Route path="/erp" element={<ERPIntegration />} />
          <Route path="/about" element={<About />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
