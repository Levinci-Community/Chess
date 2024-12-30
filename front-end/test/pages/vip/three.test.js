import React from "react";
import { render } from "@testing-library/react";
import ThreePage from "../../../src/pages/vip/three";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test("renders ThreePage snapshot", () => {
  const { asFragment } = render(<ThreePage />);
  expect(asFragment()).toMatchSnapshot();
});
