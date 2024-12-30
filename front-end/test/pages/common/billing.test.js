import React from "react";
import { render } from "@testing-library/react";
import BillingPage from "../../../src/pages/common/billing";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders BillingPage snapshot", () => {
  const { asFragment } = render(<BillingPage />);
  expect(asFragment()).toMatchSnapshot();
});
