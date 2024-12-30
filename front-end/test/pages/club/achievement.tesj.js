import React from "react";
import { render } from "@testing-library/react";
import AchievementPage from "../../../src/pages/club/achievements";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders AchievementPage snapshot", () => {
    const { container } = render(
      <Router>
        <AchievementPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });
