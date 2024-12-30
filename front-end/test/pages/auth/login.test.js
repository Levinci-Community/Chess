import React from "react";
import { render } from "@testing-library/react";
import LoginPage from "../../../src/pages/auth/login";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders LoginPage snapshot", () => {
    const { container } = render(
      <Router>
        <LoginPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });
