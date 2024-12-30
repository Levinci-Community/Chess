import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TVPage from "../../../src/pages/tv/index";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders TVPage snapshot", () => {
    const { container } = render(
      <Router>
        <TVPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });