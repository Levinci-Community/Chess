import React from "react";
import { render } from "@testing-library/react";
import SpeedRunPage from "../../../src/pages/vip/speedRun";
import '@testing-library/jest-dom'
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders SpeedRunPage snapshot", () => {
  const { asFragment } = render(<SpeedRunPage />);
  expect(asFragment()).toMatchSnapshot();
});
