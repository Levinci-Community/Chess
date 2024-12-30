import React from "react";
import { render } from "@testing-library/react";
import UpgradeVipPage from "../../../src/pages/vip/upgradeVip";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders UpgradeVipPage snapshot", () => {
  const { asFragment } = render(<UpgradeVipPage />);
  expect(asFragment()).toMatchSnapshot();
});
