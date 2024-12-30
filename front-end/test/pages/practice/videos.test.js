import React from "react";
import { render } from "@testing-library/react";
import VideosPage from "../../../src/pages/practice/videos";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: (key) => key,
    }),
  }));
  
  test("renders VideosPage snapshot", () => {
    const { container } = render(
      <Router>
        <VideosPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });