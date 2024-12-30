import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SettingsPage from "../../../src/pages/common/settings";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders SettingsPage snapshot", () => {
  const { asFragment } = render(<SettingsPage />);
  expect(asFragment()).toMatchSnapshot();
});
