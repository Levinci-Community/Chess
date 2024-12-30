import React from "react";
import { render } from "@testing-library/react";
import VideoPage from "../../../src/pages/practice/video";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: (key) => key,
    }),
  }));
  
  test("renders VideoPage snapshot", () => {
    const { container } = render(
      <Router>
        <VideoPage />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });