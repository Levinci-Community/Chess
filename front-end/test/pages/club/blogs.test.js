import React from "react";
import { render } from "@testing-library/react";
import BlogsPage from "../../../src/pages/club/blogs";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders BlogsPage snapshot", () => {
    const { container } = render(
      <Router>
        <BlogsPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });
