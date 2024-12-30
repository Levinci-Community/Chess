import React from "react";
import { render } from "@testing-library/react";
import VipPage from "../../../src/pages/vip/index";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders VipPage snapshot", () => {
  const { asFragment } = render(<VipPage />);
  expect(asFragment()).toMatchSnapshot();
});
