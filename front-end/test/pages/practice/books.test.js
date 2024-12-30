import React from "react";
import { render } from "@testing-library/react";
import BooksPage from "../../../src/pages/practice/books";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: (key) => key,
    }),
  }));
  
  test("renders BooksPage snapshot", () => {
    const { container } = render(
      <Router>
        <BooksPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });