import React from "react";
import { render } from "@testing-library/react";
import WaitingGamePage from "../../../src/pages/game/waitingGame";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: (key) => key,
    }),
  }));
  
  test("renders WaitingGamePage snapshot", () => {
    const { container } = render(
      <Router>
        <WaitingGamePage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });