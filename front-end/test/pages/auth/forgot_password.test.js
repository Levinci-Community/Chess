import React from "react";
import { render } from "@testing-library/react";
import ForgotPasswordPage from "../../../src/pages/auth/forgot_password";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders ForgotPasswordPage snapshot", () => {
    const { container } = render(
      <Router>
        <ForgotPasswordPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });
