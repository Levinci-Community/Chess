import React, { Fragment } from "react";
import { Route } from "react-router-dom";
import ForgotPasswordPage from "../pages/auth/forgot_password";
import LoginPage from "../pages/auth/login";
import LogoutPage from "../pages/auth/logout";
import RegisterPage from "../pages/auth/register";
import ResetPasswordPage from "../pages/auth/reset_password";
import ResetPasswordFailPage from "../pages/auth/resetPasswordFail";
import ResetPasswordSuccessPage from "../pages/auth/resetPasswordSuccess";
import VerifyEmailFailPage from "../pages/auth/verifiedEmailFail";
import VerifyEmailSuccessPage from "../pages/auth/verifiedEmailSuccess";
import VerifyEmailPage from "../pages/auth/verifyEmail";

const AuthRoutes = ({ setUser }) => {
  return (
    <Fragment>
      <Route path="login" element={<LoginPage setUser={setUser} />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="logout" element={<LogoutPage setUser={setUser} />} />
      <Route path="verify-email" element={<VerifyEmailPage />} />
      <Route path="verify-successful" element={<VerifyEmailSuccessPage />} />
      <Route path="verify-failure" element={<VerifyEmailFailPage />} />
      <Route
        path="reset-password-failure"
        element={<ResetPasswordFailPage />}
      />
      <Route
        path="reset-password-successful"
        element={<ResetPasswordSuccessPage />}
      />
    </Fragment>
  );
};

export default AuthRoutes;
