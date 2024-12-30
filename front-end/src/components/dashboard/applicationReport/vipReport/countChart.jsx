import React from "react";
import Chart from "react-google-charts";
import { useTranslation } from "react-i18next";

export default function CountChart({ theme, data }) {
  const { t } = useTranslation();

  if (!data) return null;

  const chartData = [
    [t("dashboard.vip"), t("dashboard.count")],
    [t("dashboard.vip"), data.vip || 0],
    [t("dashboard.not_vip"), data.not_vip || 0],
  ];

  return (
    <Chart
      width={"100%"}
      height={300}
      chartType="PieChart"
      data={chartData}
      options={{
        title: t("dashboard.vip"),
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
