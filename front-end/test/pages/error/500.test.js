import React from "react";
import { render } from "@testing-library/react";
import InternalServerErrorPage from "../../../src/pages/error/500";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: (key) => key,
    }),
  }));
  
  test("renders InternalServerErrorPage snapshot", () => {
    const { container } = render(
      <Router>
        <InternalServerErrorPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });