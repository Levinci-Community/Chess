import React from "react";
import { render } from "@testing-library/react";
import FriendPage from "../../../src/pages/friend/chat";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: (key) => key,
    }),
  }));
  
  test("renders FriendPage snapshot", () => {
    const { container } = render(
      <Router>
        <FriendPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });