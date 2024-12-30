import React from "react";
import Chart from "react-google-charts";
import { useTranslation } from "react-i18next";

export default function RatingChart({ theme, data }) {
  const { t } = useTranslation();

  if (!data) return null;

  const chartData = [
    [t("dashboard.rating"), t("dashboard.count")],
    [t("dashboard.<1000"), data["<1000"] || 0],
    [t("dashboard.<1500"), data["<1500"] || 0],
    [t("dashboard.<2000"), data["<2000"] || 0],
    [t("dashboard.>2000"), data[">2000"] || 0],
  ];

  return (
    <Chart
      width={"100%"}
      height={300}
      chartType="PieChart"
      data={chartData}
      options={{
        title: t("dashboard.rating"),
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
