import React from "react";
import { render } from "@testing-library/react";
import BlogPage from "../../../src/pages/club/blog";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders BlogPage snapshot", () => {
    const { container } = render(
      <Router>
        <BlogPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });
