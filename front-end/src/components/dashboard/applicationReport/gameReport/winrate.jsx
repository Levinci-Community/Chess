import React from "react";
import Chart from "react-google-charts";
import { useTranslation } from "react-i18next";

export default function WinrateChart({ theme, data }) {
  const { t } = useTranslation();

  if (!data) return null;

  const chartData = [
    [t("dashboard.winrate"), t("dashboard.count")],
    [t("dashboard.white"), data.white_win || 0],
    [t("dashboard.draw"), data.draw || 0],
    [t("dashboard.black"), data.black_win || 0],
  ];

  return (
    <Chart
      width={"100%"}
      height={300}
      chartType="PieChart"
      data={chartData}
      options={{
        title: t("dashboard.winrate"),
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
