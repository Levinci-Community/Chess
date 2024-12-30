import React from "react";
import { render } from "@testing-library/react";
import HastePage from "../../../src/pages/vip/haste";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders HastePage snapshot", () => {
  const { asFragment } = render(<HastePage />);
  expect(asFragment()).toMatchSnapshot();
});
