import React from "react";
import { render } from "@testing-library/react";
import InfinityPage from "../../../src/pages/vip/infinity";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders InfinityPage snapshot", () => {
  const { asFragment } = render(<InfinityPage />);
  expect(asFragment()).toMatchSnapshot();
});
