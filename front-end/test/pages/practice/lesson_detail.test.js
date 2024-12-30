import React from "react";
import { render } from "@testing-library/react";
import LessonDetailPage from "../../../src/pages/practice/lesson_detail";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: (key) => key,
    }),
  }));
  
  test("renders LessonDetailPage snapshot", () => {
    const { container } = render(
      <Router>
        <LessonDetailPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });