import {
  Box,
  Card,
  Divider,
  Flex,
  Heading,
  Spacer,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { SiBaremetrics } from "react-icons/si";
import axios from "../../../lib/axios";
import { toast_error } from "../../../lib/hooks/toast";
import appSettings from "../../../settings/appSettings";

export default function MetricSummaryReport() {
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
      .get(`${appSettings.API_PROXY}/dashboard/metric_summary`)
      .then((resp) => {
        setData(resp?.data?.data ?? defaultData);
      })
      .catch((err) => {
        console.log(err);
        toast(toast_error(t("common.something_went_wrong")));
      });
  }, [toast, t, defaultData]);

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
        {t("dashboard.metric_summary")}
      </Heading>
      <Box>
        <Box>
          <Text fontWeight={"bold"} fontSize={"small"}>
            {t("dashboard.yesterday")}
          </Text>
          {!!data?.data_yesterday ? (
            <Flex w={"100%"} h={"100%"}>
              <Box w={"45%"}>
                <Text fontSize={"sm"}>{t("dashboard.cpu_utilization")}</Text>
                <Text fontSize={"4xl"} fontWeight={"bold"} textAlign={"right"}>
                  {data.data_yesterday[0]["Average CPU utilization "]?.toFixed(
                    3,
                  ) ?? 0}
                  %
                </Text>
              </Box>
              <Spacer />
              <Box w={"45%"}>
                <Text fontSize={"sm"}>{t("dashboard.physical_memory")}</Text>
                <Text fontSize={"4xl"} fontWeight={"bold"} textAlign={"right"}>
                  {data.data_yesterday[0]["Average physical memory"]?.toFixed(
                    3,
                  ) ?? 0}
                  %
                </Text>
              </Box>
            </Flex>
          ) : (
            <Spinner />
          )}
        </Box>
        <Divider my={2} />
        <Box>
          <Text fontWeight={"bold"} fontSize={"small"}>
            {t("dashboard.last_week")}
          </Text>
          {!!data?.data_last_week ? (
            <Flex w={"100%"} h={"100%"}>
              <Box w={"45%"}>
                <Text fontSize={"sm"}>{t("dashboard.cpu_utilization")}</Text>
                <Text fontSize={"4xl"} fontWeight={"bold"} textAlign={"right"}>
                  {data.data_last_week[0]["Average CPU utilization "]?.toFixed(
                    3,
                  ) ?? 0}
                  %
                </Text>
              </Box>
              <Spacer />
              <Box w={"45%"}>
                <Text fontSize={"sm"}>{t("dashboard.physical_memory")}</Text>
                <Text fontSize={"4xl"} fontWeight={"bold"} textAlign={"right"}>
                  {data.data_last_week[0]["Average physical memory"]?.toFixed(
                    3,
                  ) ?? 0}
                  %
                </Text>
              </Box>
            </Flex>
          ) : (
            <Spinner />
          )}
        </Box>
      </Box>
    </Card>
  );
}
