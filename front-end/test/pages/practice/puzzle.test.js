import React from "react";
import { render } from "@testing-library/react";
import PuzzlePage from "../../../src/pages/practice/puzzle/index";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: (key) => key,
    }),
  }));
  
  test("renders PuzzlePage snapshot", () => {
    const { container } = render(
      <Router>
        <PuzzlePage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });