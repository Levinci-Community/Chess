import React from "react";
import { render } from "@testing-library/react";
import FriendsPage from "../../../src/pages/friend/friends";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: (key) => key,
    }),
  }));
  
  test("renders FriendsPage snapshot", () => {
    const { container } = render(
      <Router>
        <FriendsPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });