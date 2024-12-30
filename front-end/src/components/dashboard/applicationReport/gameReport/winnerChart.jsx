import React from "react";
import Chart from "react-google-charts";
import { useTranslation } from "react-i18next";

export default function WinnerChart({ theme, data }) {
  const { t } = useTranslation();

  if (!data) return null;

  const chartData = [
    [t("dashboard.winner"), t("dashboard.count")],
    [t("dashboard.ai"), data.ai || 0],
    [t("dashboard.player"), data.player || 0],
  ];

  return (
    <Chart
      width={"100%"}
      height={300}
      chartType="PieChart"
      data={chartData}
      options={{
        title: t("dashboard.winner"),
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
