import React from "react";
import { render } from "@testing-library/react";
import CountDownPage from "../../../src/pages/vip/countDown";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders CountDownPage snapshot", () => {
  const { asFragment } = render(<CountDownPage />);
  expect(asFragment()).toMatchSnapshot();
});
