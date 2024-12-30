import React from "react";
import { render } from "@testing-library/react";
import ForgotPasswordConfirmationPage from "../../../src/pages/auth/register";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders ForgotPasswordConfirmationPage snapshot", () => {
    const { container } = render(
      <Router>
        <ForgotPasswordConfirmationPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });
