import React from "react";
import Chart from "react-google-charts";
import { useTranslation } from "react-i18next";

export default function AiLevelChart({ theme, data }) {
  const { t } = useTranslation();

  if (!data) return null;

  const chartData = [
    [t("dashboard.aiLevel"), t("dashboard.count")],
    [t("dashboard.1"), data["1"] || 0],
    [t("dashboard.2"), data["2"] || 0],
    [t("dashboard.3"), data["3"] || 0],
    [t("dashboard.4"), data["4"] || 0],
    [t("dashboard.5"), data["5"] || 0],
    [t("dashboard.6"), data["6"] || 0],
    [t("dashboard.7"), data["7"] || 0],
    [t("dashboard.8"), data["8"] || 0],
    [t("dashboard.9"), data["9"] || 0],
    [t("dashboard.10"), data["10"] || 0],
  ];

  return (
    <Chart
      width={"100%"}
      height={300}
      chartType="PieChart"
      data={chartData}
      options={{
        title: t("dashboard.aiLevel"),
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
