import React, { Fragment } from "react";
import { Route } from "react-router-dom";
import AchievementsPage from "../pages/club/achievements";
import DonatePage from "../pages/club/donate";
import AboutPage from "../pages/common/about";
import BillingPage from "../pages/common/billing";
import SettingsPage from "../pages/common/settings";

const CommonRoutes = () => {
  return (
    <Fragment>
      <Route path="about" element={<AboutPage />} />
      <Route path="donate" element={<DonatePage />} />
      <Route path="achievements" element={<AchievementsPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="billing" element={<BillingPage />} />
    </Fragment>
  );
};

export default CommonRoutes;
