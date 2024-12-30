import React from "react";
import { render } from "@testing-library/react";
import ChesslePage from "../../../src/pages/practice/chessle";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));
jest.mock('gapi-script');
test("renders ChesslePage snapshot", () => {
    const { container } = render(
      <Router>
        <ChesslePage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });
