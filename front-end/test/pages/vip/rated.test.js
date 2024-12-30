import React from "react";
import { render } from "@testing-library/react";
import RatePage from "../../../src/pages/vip/rated";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders RatePage snapshot", () => {
  const { asFragment } = render(<RatePage />);
  expect(asFragment()).toMatchSnapshot();
});
