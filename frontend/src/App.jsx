import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { Login } from "./pages/Login/Login";
import { SignUp } from "./pages/SignUp/SignUp";
import {ForgotPassword} from "./pages/ForgotPassword/ForgotPassword"; // This is a default export
import {EnterOTPForgotPassword} from "./pages/EnterOTPForgotPassword/EnterOTPForgotPassword"; // New import
import {ResetPassword} from "./pages/ResetPassword/ResetPassword"; // This is a default export
import {RootRedirector} from "./components/RootRedirector/RootRedirector"; // This is a default export

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRedirector />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/enter-otp-for-reset"
          element={<EnterOTPForgotPassword />}
        />
        <Route path="/reset-password-final" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
