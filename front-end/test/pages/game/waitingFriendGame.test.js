import React from "react";
import { render } from "@testing-library/react";
import WaitingFriendGamePage from "../../../src/pages/game/waitingFriendGame";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: (key) => key,
    }),
  }));
  
  test("renders WaitingFriendGamePage snapshot", () => {
    const { container } = render(
      <Router>
        <WaitingFriendGamePage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });