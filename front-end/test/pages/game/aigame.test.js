import React from "react";
import { render } from "@testing-library/react";
import AiGamePage from "../../../src/pages/game/aiGamePage";
import { BrowserRouter as Router } from "react-router-dom";
import '@testing-library/jest-dom'

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: (key) => key,
    }),
  }));
  
  test("renders AiGamePage snapshot", () => {
    const { container } = render(
      <Router>
        <AiGamePage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });