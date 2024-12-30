import React from "react";
import { render } from "@testing-library/react";
import GameSettingsPage from "../../../src/pages/game/gameSettingsPage";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: (key) => key,
    }),
  }));
  
  test("renders GameSettingsPage snapshot", () => {
    const { container } = render(
      <Router>
        <GameSettingsPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });