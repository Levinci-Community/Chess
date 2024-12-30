import { Card, Flex, Heading, Spinner, useToast } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import Chart from "react-google-charts";
import { useTranslation } from "react-i18next";
import { SiBaremetrics } from "react-icons/si";
import axios from "../../../lib/axios";
import { toast_error } from "../../../lib/hooks/toast";
import appSettings from "../../../settings/appSettings";

export default function AjaxRequestHttpMethodReport({ theme }) {
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
      .get(`${appSettings.API_PROXY}/dashboard/ajax_request_http_method`)
      .then((resp) => {
        setData(resp?.data?.data ?? defaultData);
      })
      .catch((err) => {
        console.log(err);
        toast(toast_error(t("common.something_went_wrong")));
      });
  }, [toast, t, defaultData]);

  const renderPieChart = (dataset, title) => {
    if (!dataset) return;

    const chartData = [
      [t("dashboard.http_method"), t("dashboard.count")],
      ...dataset.map((item) => [item.facet, item.count]),
    ];

    return (
      <Chart
        width={"100%"}
        height={300}
        chartType="PieChart"
        data={chartData}
        options={{
          title: title,
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
        {t("dashboard.ajax_request_http_method")}
      </Heading>
      <Flex>
        <Flex w={"50%"} h={"100%"}>
          {renderPieChart(data?.data_yesterday, t("dashboard.yesterday")) ?? (
            <Spinner />
          )}
        </Flex>
        <Flex w={"50%"} h={"100%"}>
          {renderPieChart(data?.data_last_week, t("dashboard.last_week")) ?? (
            <Spinner />
          )}
        </Flex>
      </Flex>
    </Card>
  );
}
