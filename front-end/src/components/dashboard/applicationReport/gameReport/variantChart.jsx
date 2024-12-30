import React from "react";
import Chart from "react-google-charts";
import { useTranslation } from "react-i18next";

export default function VariantChart({ theme, data }) {
  const { t } = useTranslation();

  if (!data) return null;

  const chartData = [
    [t("dashboard.variant"), t("dashboard.count")],
    [t("dashboard.chess"), data.chess || 0],
  ];

  return (
    <Chart
      width={"100%"}
      height={300}
      chartType="PieChart"
      data={chartData}
      options={{
        title: t("dashboard.variant"),
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
