import React from "react";
import Chart from "react-google-charts";
import { useTranslation } from "react-i18next";

export default function TimeChart({ theme, data }) {
  const { t } = useTranslation();

  if (!data) return null;

  const chartData = [
    [t("dashboard.time"), t("dashboard.count")],
    [t("dashboard.bullet"), data.bullet || 0],
    [t("dashboard.blitz"), data.blitz || 0],
    [t("dashboard.rapid"), data.rapid || 0],
    [t("dashboard.classical"), data.classical || 0],
  ];

  return (
    <Chart
      width={"100%"}
      height={300}
      chartType="PieChart"
      data={chartData}
      options={{
        title: t("dashboard.time"),
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
