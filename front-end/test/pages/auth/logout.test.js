import React from "react";
import { render } from "@testing-library/react";
import LogoutPage from "../../../src/pages/auth/logout";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders LogoutPage snapshot", () => {
    const { container } = render(
      <Router>
        <LogoutPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });
