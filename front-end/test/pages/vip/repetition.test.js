import React from "react";
import { render } from "@testing-library/react";
import RepetitionPage from "../../../src/pages/vip/repetition";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders RepetitionPage snapshot", () => {
  const { asFragment } = render(<RepetitionPage />);
  expect(asFragment()).toMatchSnapshot();
});
