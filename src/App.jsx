import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import VerifyOtp from "./components/VerifyOtp";
import ResetPassword from "./components/ResetPassword";
import PasswordResetSuccess from "./components/PasswordResetSuccess";
import Dashboard from "./components/Dashboard";
import EditProfile from "./components/EditProfile";
import ChangePassword from "./components/ChangePassword";
import AddCredential from "./components/AddCredential";
import Credentials from "./components/Credentials";
import EditCredential from "./components/EditCredential";
import SessionTimeout from "./components/SessionTimeout";
import SharedWithMe from "./components/SharedWithMe";
import SharedByMe from "./components/SharedByMe";
import SecurityAnalytics from "./components/SecurityAnalytics";
import SecurityReports from "./components/SecurityReports";
function App() {
  return (
    <BrowserRouter>
    {localStorage.getItem("token") && <SessionTimeout />}
      <Routes>
       <Route path="/" element={<Login />} />
<Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
    path="/password-reset-success"
    element={<PasswordResetSuccess />}
/>
<Route path="/profile" element={<Profile />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/edit-profile" element={<EditProfile />} />
<Route path="/change-password" element={<ChangePassword />} />
<Route path="/add-credential" element={<AddCredential />} />
<Route
    path="/credentials"
    element={<Credentials />}
/>
<Route 
path="/edit-credential/:id" 
element={<EditCredential />} 
/>
<Route
    path="/shared-with-me"
    element={<SharedWithMe />}
/>
<Route
    path="/shared-by-me"
    element={<SharedByMe />}
/>
<Route
    path="/security-analytics"
    element={<SecurityAnalytics />}
/>
<Route
    path="/security-reports"
    element={<SecurityReports />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;