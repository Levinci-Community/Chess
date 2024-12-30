import React from "react";
import { render } from "@testing-library/react";
import DonatePage from "../../../src/pages/club/donate";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders DonatePage snapshot", () => {
    const { container } = render(
      <Router>
        <DonatePage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });
