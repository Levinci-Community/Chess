import React from "react";
import { render } from "@testing-library/react";
import LessonsPage from "../../../src/pages/practice/lessons";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: (key) => key,
    }),
  }));
  
  test("renders LessonsPage snapshot", () => {
    const { container } = render(
      <Router>
        <LessonsPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });