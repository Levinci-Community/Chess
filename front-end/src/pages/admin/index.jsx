import {
  Box,
  Container,
  Flex,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GameReport from "../../components/dashboard/applicationReport/gameReport";
import UserReport from "../../components/dashboard/applicationReport/userReport";
import VipReport from "../../components/dashboard/applicationReport/vipReport";
import NewAchievements from "../../components/dashboard/documentReport/newAchievements";
import NewBlogs from "../../components/dashboard/documentReport/newBlogs";
import NewBooks from "../../components/dashboard/documentReport/newBooks";
import NewVideos from "../../components/dashboard/documentReport/newVideos";
import AjaxRequestHostnameReport from "../../components/dashboard/systemReport/AjaxRequestHostnameReport";
import AjaxRequestHttpMethodReport from "../../components/dashboard/systemReport/AjaxRequestHttpMethodReport";
import AjaxRequestPageUrlReport from "../../components/dashboard/systemReport/AjaxRequestPageUrlReport";
import ApdexReport from "../../components/dashboard/systemReport/ApdexReport";
import BrowserInteractionReport from "../../components/dashboard/systemReport/BrowserInteractionReport";
import MetricSummaryReport from "../../components/dashboard/systemReport/MetricSummaryReport";
import TransactionSummaryReport from "../../components/dashboard/systemReport/TransactionSummaryReport";
import axios from "../../lib/axios";
import { toast_error } from "../../lib/hooks/toast";
import appSettings from "../../settings/appSettings";

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const theme = localStorage.getItem("theme");
  const toast = useToast();
  const [books, setBooks] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [videos, setVideos] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [userReport, setUserReport] = useState();
  const [onlineGameReport, setOnlineGameReport] = useState();
  const [aiGameReport, setAiGameReport] = useState();
  const [vipReport, setVipReport] = useState();

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/blogs/top/5`)
      .then((resp) => {
        setBlogs(resp?.data?.blogs ?? []);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });

    axios
      .get(`${appSettings.API_PROXY}/books/top/5`)
      .then((resp) => {
        setBooks(resp?.data?.books ?? []);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });

    axios
      .get(`${appSettings.API_PROXY}/videos/top/5`)
      .then((resp) => {
        setVideos(resp?.data?.videos ?? []);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });

    axios
      .get(`${appSettings.API_PROXY}/achievements/top/5`)
      .then((resp) => {
        setAchievements(resp?.data?.achievements ?? []);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });

    axios
      .get(`${appSettings.API_PROXY}/users/report`)
      .then((resp) => {
        setUserReport(resp?.data?.data);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });

    axios
      .get(`${appSettings.API_PROXY}/onlineGame/report`)
      .then((resp) => {
        setOnlineGameReport(resp?.data);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });

    axios
      .get(`${appSettings.API_PROXY}/aiGame/report`)
      .then((resp) => {
        setAiGameReport(resp?.data);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });

    axios
      .get(`${appSettings.API_PROXY}/users/vip-report`)
      .then((resp) => {
        setVipReport(resp?.data?.data);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });
  }, [toast, t]);

  return (
    <Fragment>
      <Tabs>
        <TabList mx={8}>
          <Tab>{t("admin.application_report")}</Tab>
          <Tab>{t("admin.performance_report")}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Container maxW="container.2xl" py={4}>
              <Flex w={"100%"}>
                <Box w={"49%"}>
                  <UserReport data={userReport} />
                </Box>
                <Spacer />
                <Box w={"49%"}>
                  <VipReport vipReport={vipReport} userReport={userReport} />
                </Box>
              </Flex>
              <Flex w={"100%"}>
                <Box w={"65%"}>
                  <GameReport
                    online={onlineGameReport}
                    offline={aiGameReport}
                  />
                </Box>
                <Spacer />
                <Box w={"33%"}>
                  <NewBooks data={books} />
                  <NewVideos data={videos} />
                  <NewBlogs data={blogs} />
                  <NewAchievements data={achievements} />
                </Box>
              </Flex>
            </Container>
          </TabPanel>
          <TabPanel>
            <Container maxW="container.2xl" py={4}>
              <Flex>
                <Box w={"49%"}>
                  <MetricSummaryReport />
                  <AjaxRequestHttpMethodReport theme={theme} />
                </Box>
                <Spacer />
                <Box w={"49%"}>
                  <TransactionSummaryReport />
                  <ApdexReport theme={theme} />
                </Box>
              </Flex>
              <Flex>
                <Box w={"49%"}>
                  <BrowserInteractionReport theme={theme} />
                </Box>
                <Spacer />
                <Box w={"49%"}>
                  <AjaxRequestHostnameReport theme={theme} />
                  <AjaxRequestPageUrlReport theme={theme} />
                </Box>
              </Flex>
            </Container>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Fragment>
  );
}
