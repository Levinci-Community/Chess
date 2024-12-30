import React from "react";
import { render } from "@testing-library/react";
import ClubPage from "../../../src/pages/club/index";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders ClubPage snapshot", () => {
    const { container } = render(
      <Router>
        <ClubPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });
