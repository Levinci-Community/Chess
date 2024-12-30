import React from "react";
import { render } from "@testing-library/react";
import RegisterPage from "../../../src/pages/auth/register";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders RegisterPage snapshot", () => {
    const { container } = render(
      <Router>
        <RegisterPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });
