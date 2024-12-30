import {
  Box,
  Card,
  Container,
  Flex,
  Heading,
  Spacer,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ChatBox from "../../components/chat/chatbox";
import GroupButtonNav from "../../components/nav/groupButtonNav";
import UpdateVipNow from "../../components/vip/updateVipNow";
import axios from "../../lib/axios";
import { formatDate, formatDatetime } from "../../lib/datetime";
import { toast_error } from "../../lib/hooks/toast";
import appSettings from "../../settings/appSettings";

export default function ClubPage({ user }) {
  const theme = localStorage.getItem("theme");
  const { t } = useTranslation();
  const toast = useToast();

  const [meetingInfo, setMeetingInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/offline-calendar`)
      .then((resp) => {
        setMeetingInfo(resp?.data?.offline_calendar ?? []);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });

    axios
      .get(`${appSettings.API_PROXY}/notifications/top`)
      .then((resp) => {
        setNotifications(resp?.data?.notifications ?? []);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });
  }, [toast, t]);

  return (
    <Fragment>
      <Container maxW="container.2xl" py={4}>
        <Flex direction={{ base: "column", md: "row" }}>
          <Flex
            w={{ base: "100%", lg: "24%" }}
            mb={{ base: 8, md: 0 }}
            flexDir={"column"}
          >
            <Box
              w={"100%"}
              border={"1px solid lightgray"}
              borderRadius={8}
              p={4}
              bgColor={theme === "dark" ? "black" : "gray.100"}
            >
              <Heading fontSize={"xl"} mb={4}>
                {t("club.calendar_club_meeting")}
              </Heading>
              <Text fontSize="md" mb={4}>
                {t("club.welcome_to_calendar_club_meeting")}
              </Text>
              <Box>
                <Text fontSize="md" noOfLines={1}>
                  <strong>{t("club.date_time")}:</strong>{" "}
                  {meetingInfo?.time
                    ? formatDatetime(meetingInfo.time)
                    : t("club.datetime_not_found")}
                </Text>
              </Box>
              <Box mt={4}>
                <Text fontSize="md" noOfLines={3}>
                  <strong>{t("club.location")}</strong> :{" "}
                  {meetingInfo?.location ?? t("club.location_not_found")}
                </Text>
              </Box>
            </Box>
            <Spacer />
            <GroupButtonNav />
          </Flex>
          <Spacer display={{ base: "none", md: "block" }} />
          <Box w={{ base: "100%", lg: "48%" }} mb={{ base: 8, md: 0 }}>
            <Box w={"100%"}>
              <Heading fontSize={"xl"} mx={4} mt={4} mb={4}>
                {t("club.notifications")}
              </Heading>
              <Box border={"1px lightgray solid"} borderRadius={8}>
                {notifications?.length > 0 ? (
                  notifications.map((notification) => {
                    return (
                      <Card
                        key={notification._id}
                        px={4}
                        py={2}
                        borderBottom={"1px solid rgba(0,0,0,0.05)"}
                        bgColor={"transparent"}
                      >
                        <Flex alignItems={"center"} minH={20}>
                          <Box w={"85%"}>
                            <Text fontWeight={"bold"} noOfLines={1}>
                              {notification.title}
                            </Text>
                            <Text noOfLines={2}>
                              {notification.description}
                            </Text>
                          </Box>
                          <Box w={"15%"}>
                            <Text
                              fontSize="xs"
                              color="gray.500"
                              align={"right"}
                            >
                              {t("club.created")}:
                            </Text>
                            <Text
                              fontSize="xs"
                              color="gray.500"
                              align={"right"}
                            >
                              {formatDate(notification.created_at)}
                            </Text>
                          </Box>
                        </Flex>
                      </Card>
                    );
                  })
                ) : (
                  <Spinner />
                )}
              </Box>
            </Box>
          </Box>
          <Spacer display={{ base: "none", md: "block" }} />
          <Box
            w={{ base: "100%", lg: "24%" }}
            display={{ base: "none", md: "block" }}
            h={"fit-content"}
            borderRadius={8}
          >
            {<UpdateVipNow user={user} />}
            <ChatBox />
          </Box>
        </Flex>
      </Container>
    </Fragment>
  );
}
