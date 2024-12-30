import React from "react";
import Chart from "react-google-charts";
import { useTranslation } from "react-i18next";

export default function CurrentExpiredChart({ theme, data }) {
  const { t } = useTranslation();

  if (!data) return null;

  const chartData = [
    [t("dashboard.current_expired"), t("dashboard.count")],
    [t("dashboard.current"), data.recent_vip_count || 0],
    [t("dashboard.expired"), data.upcoming_expiry_count || 0],
  ];

  return (
    <Chart
      width={"100%"}
      height={300}
      chartType="PieChart"
      data={chartData}
      options={{
        title: t("dashboard.current_expired"),
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
