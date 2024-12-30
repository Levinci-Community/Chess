import React from "react";
import Chart from "react-google-charts";
import { useTranslation } from "react-i18next";

export default function VerifyChart({ theme, data }) {
  const { t } = useTranslation();

  if (!data) return null;

  const chartData = [
    [t("dashboard.verification_status"), t("dashboard.count")],
    [t("dashboard.is_verified"), data.is_verified || 0],
    [t("dashboard.not_verified"), data.not_verified || 0],
  ];

  return (
    <Chart
      width={"100%"}
      height={300}
      chartType="PieChart"
      data={chartData}
      options={{
        title: t("dashboard.verified"),
        legend: { position: "top" },
        backgroundColor: "transparent",
        legendTextStyle: {
          color: theme === "dark" ? "white" : "black",
        },
        titleTextStyle: {
          color: theme === "dark" ? "white" : "black",
        },
      }}
    />
  );
}
