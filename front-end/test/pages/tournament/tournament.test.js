
import React from "react";
import { render } from "@testing-library/react";
import TournamentPage from "../../../src/pages/tournament/tournament";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key) => key, 
    }),
  }));

test("renders TournamentPage snapshot", () => {
  const { container } = render(
    <Router>
      <TournamentPage />
    </Router>
  );
  expect(container).toMatchSnapshot();
});
