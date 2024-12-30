import React from "react";
import { render } from "@testing-library/react";
import OnlineGamePage from "../../../src/pages/game/online-game";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: (key) => key,
    }),
  }));
  
  test("renders OnlineGamePage snapshot", () => {
    const { container } = render(
      <Router>
        <OnlineGamePage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });