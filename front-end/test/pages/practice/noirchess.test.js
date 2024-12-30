import React from "react";
import { render } from "@testing-library/react";
import NoirchessPage from "../../../src/pages/practice/noirchess";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: (key) => key,
    }),
  }));
  
  test("renders NoirchessPage snapshot", () => {
    const { container } = render(
      <Router>
        <NoirchessPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });