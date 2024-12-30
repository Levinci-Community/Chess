import React from "react";
import { render } from "@testing-library/react";
import LobbyPage from "../../../src/pages/game/lobby";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: (key) => key,
    }),
  }));
  
  test("renders LobbyPage snapshot", () => {
    const { container } = render(
      <Router>
        <LobbyPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });