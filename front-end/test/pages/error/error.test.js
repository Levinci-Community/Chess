import React from "react";
import { render } from "@testing-library/react";
import ErrorPage from "../../../src/pages/error/index";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: (key) => key,
    }),
  }));
  
  test("renders ErrorPage snapshot", () => {
    const { container } = render(
      <Router>
        <ErrorPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });