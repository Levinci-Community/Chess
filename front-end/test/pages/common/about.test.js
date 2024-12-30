import React from "react";
import { render } from "@testing-library/react";
import AboutPage from "../../../src/pages/common/about";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders AboutPage snapshot", () => {
    const { container } = render(
      <Router>
        <AboutPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });
