import React from "react";
import { render } from "@testing-library/react";
import NotFoundPage from "../../../src/pages/error/404";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: (key) => key,
    }),
  }));
  
  test("renders NotFoundPage snapshot", () => {
    const { container } = render(
      <Router>
        <NotFoundPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });