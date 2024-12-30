import React from "react";
import { render } from "@testing-library/react";
import BookPage from "../../../src/pages/practice/book";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders BookPage snapshot", () => {
    const { container } = render(
      <Router>
        <BookPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });
