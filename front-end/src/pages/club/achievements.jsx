import {
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  Spacer,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LeftNav from "../../components/nav/leftNav";
import axios from "../../lib/axios";
import { formatDate } from "../../lib/datetime";
import { toast_error } from "../../lib/hooks/toast";
import appSettings from "../../settings/appSettings";

export default function AchievementPage() {
  const { t } = useTranslation();
  const theme = localStorage.getItem("theme");
  const toast = useToast();
  const [data, setData] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/achievements/honor-list`)
      .then((resp) => {
        setData(resp?.data?.honor_list ?? {});
        setEvents(resp?.data?.events ?? []);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });
  }, [toast, t]);

  return (
    <Fragment>
      <Container maxW="container.2xl" py={4}>
        <Flex>
          <Box
            w={{ base: "0%", md: "24%" }}
            display={{ base: "none", md: "block" }}
          >
            <LeftNav />
          </Box>
          <Spacer />
          <Box w={{ base: "100%", md: "74%" }}>
            <Heading fontSize={"xl"} as="h1" mb={4}>
              {t("achievements.achievements")}
            </Heading>
            <Box mt={8}>
              {events?.length !== 0 ? (
                events
                  .sort((a, b) => ("" + a.time).localeCompare(b.time) * -1)
                  .map((event, index) => (
                    <Box key={index}>
                      <Flex mb={4} justifyContent={"center"}>
                        <Text
                          textAlign={"center"}
                          fontWeight={"bold"}
                          fontSize={"md"}
                        >
                          {event.event}
                        </Text>
                        <Text
                          textAlign={"center"}
                          ml={4}
                          fontSize={"md"}
                          fontWeight={"light"}
                        >
                          ({formatDate(event.time)})
                        </Text>
                      </Flex>
                      {data[event?.time] && (
                        <Table
                          size={{ base: "sm", md: "md" }}
                          colorScheme="gray"
                          borderRadius={4}
                          overflow={"hidden"}
                          __css={{ "table-layout": "fixed", width: "full" }}
                          variant={"striped"}
                        >
                          <Thead
                            bgColor={theme === "dark" ? "black" : "gray.200"}
                          >
                            <Tr>
                              <Th width="15%" textAlign={"center"}>
                                {t("common.no")}
                              </Th>
                              <Th
                                width="30%"
                                textAlign={"left"}
                                cursor={"pointer"}
                              >
                                {t("achievements.member")}
                              </Th>
                              <Th
                                width="60%"
                                textAlign={"left"}
                                cursor={"pointer"}
                              >
                                {t("achievements.reward")}
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {data[event?.time].map((item, index) => (
                              <Tr
                                key={index}
                                userSelect="none"
                                cursor="pointer"
                              >
                                <Td textAlign={"center"}>{index + 1}</Td>
                                <Td
                                  textAlign={"left"}
                                  overflow="hidden"
                                  whiteSpace="nowrap"
                                  textOverflow="ellipsis"
                                >
                                  {item.member}
                                </Td>
                                <Td
                                  textAlign={"left"}
                                  overflow="hidden"
                                  whiteSpace="nowrap"
                                  textOverflow="ellipsis"
                                >
                                  {item.reward}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      )}
                      <Divider
                        mb={8}
                        borderColor={theme === "dark" ?? "black"}
                      />
                    </Box>
                  ))
              ) : (
                <Spinner />
              )}
            </Box>
          </Box>
        </Flex>
      </Container>
    </Fragment>
  );
}
