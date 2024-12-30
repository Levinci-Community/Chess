import { WarningIcon } from "@chakra-ui/icons";
import { Card, Flex, Heading, Spinner, Text, useToast } from "@chakra-ui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import Chart from "react-google-charts";
import { useTranslation } from "react-i18next";
import { SiBaremetrics } from "react-icons/si";
import axios from "../../../lib/axios";
import { toast_error } from "../../../lib/hooks/toast";
import appSettings from "../../../settings/appSettings";

export default function ApdexReport({ theme }) {
  const { t } = useTranslation();
  const toast = useToast();
  const [data, setData] = useState(null);

  const defaultData = useMemo(() => {
    return {
      data_last_week: [],
    };
  }, []);

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/dashboard/apdex`)
      .then((resp) => {
        setData(resp?.data?.data ?? defaultData);
      })
      .catch((err) => {
        console.log(err);
        toast(toast_error(t("common.something_went_wrong")));
      });
  }, [toast, t, defaultData]);

  const getColorBasedOnScore = (score) => {
    if (score >= 0.85) return "#4CAF50";
    if (score >= 0.7) return "#FFC107";
    if (score >= 0.5) return "#FF9800";
    return "#F44336";
  };

  const renderColumnChart = (dataset, title) => {
    if (!dataset) return;

    const chartData = [
      [t("dashboard.time"), t("dashboard.apdex"), { role: "style" }],
      ...dataset.map((item) => [
        item.facet,
        item.score,
        getColorBasedOnScore(item.score),
      ]),
    ];

    return (
      <Fragment>
        {chartData.length > 1 ? (
          <Chart
            width={"100%"}
            height={300}
            chartType="ColumnChart"
            data={chartData}
            options={{
              title: title,
              legend: { position: "none" },
              hAxis: { textPosition: "none" },
              vAxis: {
                textStyle: { color: theme === "dark" ? "white" : "black" },
              },
              backgroundColor: "transparent",
              legendTextStyle: {
                color: theme === "dark" ? "white" : "black",
              },
              titleTextStyle: {
                color: theme === "dark" ? "white" : "black",
              },
            }}
          />
        ) : (
          <Flex
            alignItems={"center"}
            justifyContent={"center"}
            w={"100%"}
            h={"100%"}
          >
            <WarningIcon />
            <Text>{t("dashboard.no_data")}</Text>
          </Flex>
        )}
      </Fragment>
    );
  };

  return (
    <Card
      filter="auto"
      brightness="98%"
      p={1}
      variant={"outline"}
      overflow={"hidden"}
      borderRadius={4}
      mb={2}
      minH={120}
    >
      <Heading
        as={"h5"}
        fontSize={"md"}
        display={"flex"}
        alignItems={"center"}
        mb={1}
      >
        <SiBaremetrics style={{ marginRight: 4 }} />
        {t("dashboard.apdex")}
      </Heading>
      <Flex w={"100%"} h={"100%"}>
        {renderColumnChart(data?.data_last_week, t("dashboard.last_week")) ?? (
          <Spinner />
        )}
      </Flex>
    </Card>
  );
}
