import React, { Fragment } from "react";
import { Route } from "react-router-dom";
import ErrorPage from "../pages/error";
import NotFoundPage from "../pages/error/404";
import InternalServerErrorPage from "../pages/error/500";
const ErrorRoutes = () => {
  return (
    <Fragment>
      <Route path="error" element={<ErrorPage />} />
      <Route path="not-found" element={<NotFoundPage />} />
      <Route
        path="internal-server-error"
        element={<InternalServerErrorPage />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Fragment>
  );
};

export default ErrorRoutes;
