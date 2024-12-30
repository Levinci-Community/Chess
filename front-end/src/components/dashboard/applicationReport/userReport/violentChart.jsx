import React from "react";
import Chart from "react-google-charts";
import { useTranslation } from "react-i18next";

export default function ViolentChart({ theme, data }) {
  const { t } = useTranslation();

  if (!data) return null;

  const chartData = [
    [t("dashboard.violent_status"), t("dashboard.count")],
    [t("dashboard.is_locked"), data.is_locked || 0],
    [t("dashboard.not_locked"), data.not_locked || 0],
  ];

  return (
    <Chart
      width={"100%"}
      height={300}
      chartType="PieChart"
      data={chartData}
      options={{
        title: t("dashboard.locked"),
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
