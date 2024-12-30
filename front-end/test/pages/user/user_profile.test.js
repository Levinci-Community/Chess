import React from "react";
import UserProfile from "../../../src/pages/user/user_profile";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));


test("renders UserProfile snapshot", () => {
  const { container } = render(
    <Router>
      <UserProfile />
    </Router>
  );
  expect(container).toMatchSnapshot();
});