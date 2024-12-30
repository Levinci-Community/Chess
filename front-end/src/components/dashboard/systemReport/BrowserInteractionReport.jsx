import { WarningIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  Flex,
  Heading,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import Chart from "react-google-charts";
import { useTranslation } from "react-i18next";
import { SiBaremetrics } from "react-icons/si";
import axios from "../../../lib/axios";
import { toast_error } from "../../../lib/hooks/toast";
import appSettings from "../../../settings/appSettings";

export default function BrowserInteractionReport({ theme }) {
  const { t } = useTranslation();
  const toast = useToast();
  const [data, setData] = useState(null);

  const defaultData = useMemo(() => {
    return {
      data_last_week: [],
      data_yesterday: [],
    };
  }, []);

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/dashboard/browser_interaction`)
      .then((resp) => {
        setData(resp?.data?.data ?? defaultData);
      })
      .catch((err) => {
        console.log(err);
        toast(toast_error(t("common.something_went_wrong")));
      });
  }, [toast, t, defaultData]);

  const renderLineChart = (dataset, title) => {
    if (!dataset) return;

    const chartData = [
      [
        t("dashboard.time"),
        t("dashboard.median_duration"),
        t("dashboard.average_duration"),
      ],
      ...dataset.map((item) => [
        new Date(item.beginTimeSeconds ?? 0 * 1000).toLocaleString(),
        item.Median["50"] ?? 0,
        item["average.duration"] ?? 0,
      ]),
    ];

    return (
      <Fragment>
        {chartData.length > 1 ? (
          <Chart
            width={"100%"}
            height={300}
            chartType="LineChart"
            data={chartData}
            options={{
              title: title,
              legend: { position: "top" },
              hAxis: {
                title: t("dashboard.time"),
                textPosition: "none",
                textStyle: { color: theme === "dark" ? "white" : "black" },
              },
              vAxis: {
                title: t("dashboard.duration"),
                minValue: 0,
                maxValue: 100,
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
        {t("dashboard.browser_interaction")}
      </Heading>
      <Box>
        <Flex w={"100%"} h={"100%"}>
          {renderLineChart(data?.data_yesterday, t("dashboard.yesterday")) ?? (
            <Spinner />
          )}
        </Flex>
        <Flex w={"100%"} h={"100%"}>
          {renderLineChart(data?.data_last_week, t("dashboard.last_week")) ?? (
            <Spinner />
          )}
        </Flex>
      </Box>
    </Card>
  );
}
