import {
  Box,
  Card,
  Container,
  Divider,
  Flex,
  Heading,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";

import {
  AddIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../lib/auth";
import axios from "../../lib/axios";
import { formatDate } from "../../lib/datetime";
import { useCurrentPath } from "../../lib/hooks/route";
import { toast_error, toast_success } from "../../lib/hooks/toast";
import socket from "../../lib/socket";
import appSettings from "../../settings/appSettings";

export default function TournamentPage(props) {
  const path = useCurrentPath();
  const id = path[path.length - 1];
  const toast = useToast();
  const theme = localStorage.getItem("theme");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const user = getUserData();
  const [data, setData] = useState({});
  const [userJoin, setUserJoin] = useState(false);
  const [your_games, setYourGames] = useState([]);
  const [scoreboard, setScoreBoard] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${appSettings.API_PROXY}/tournaments/${id}`)
      .then((resp) => {
        setData(resp?.data?.tournament ?? {});
        const players = resp?.data?.tournament?.players ?? [];
        setUserJoin(players.includes(user?.id));
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [toast, id, t, user?.id]);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${appSettings.API_PROXY}/tournamentGame/${id}/game-history`)
      .then((resp) => {
        setYourGames(resp?.data?.data ?? []);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [toast, t, id]);

  const handleReloadScoreBoard = useCallback(() => {
    setIsLoading(true);
    axios
      .get(`${appSettings.API_PROXY}/tournaments/${id}/scoreboard`)
      .then((resp) => {
        setScoreBoard(resp?.data?.scoreboard ?? []);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [toast, t, id]);

  const handleUserJoinTournament = useCallback(() => {
    setIsLoading(true);
    axios
      .post(`${appSettings.API_PROXY}/tournaments/${id}/join`)
      .then((resp) => {
        setUserJoin(true);
        socket.emit("join_tournament", { tournament_id: id, user_id: user.id });
        toast(toast_success(t("tournaments.join_success")));
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      })
      .finally(handleReloadScoreBoard);
  }, [id, t, toast, handleReloadScoreBoard, user]);

  const handleUserLeaveTournament = useCallback(() => {
    setIsLoading(true);
    axios
      .delete(`${appSettings.API_PROXY}/tournaments/${id}/leave`)
      .then((resp) => {
        setUserJoin(false);
        socket.emit("leave_tournament", {
          tournament_id: id,
          user_id: user.id,
        });
        toast(toast_success(t("tournaments.leave_success")));
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      })
      .finally(handleReloadScoreBoard);
  }, [id, t, toast, handleReloadScoreBoard, user]);

  const handleSocketJoinTournament = useCallback(() => {
    console.log("join_tournament");
  }, []);

  const handleSocketTournamentGameFound = useCallback(
    (game) => {
      if (user.id === game.white || user.id === game.black) {
        navigate(`/tournament/game/${game._id}`);
      }
    },
    [navigate, user]
  );

  useEffect(() => {
    handleReloadScoreBoard();
  }, [handleReloadScoreBoard]);

  useEffect(() => {
    socket.connect();

    socket.emit("join_tournament", { tournament_id: id, user_id: user.id });

    socket.on("join_tournament", handleSocketJoinTournament);
    socket.on("tournament_game_found", handleSocketTournamentGameFound);

    return () => {
      socket.off("join_tournament", handleSocketJoinTournament);
      socket.off("tournament_game_found", handleSocketTournamentGameFound);
      if (socket.readyState === 1) {
        socket.emit("leave_tournament", {
          tournament_id: id,
          user_id: user.id,
        });
        socket.disconnect();
      }
    };
  }, [
    handleSocketJoinTournament,
    handleSocketTournamentGameFound,
    id,
    user.id,
  ]);

  return (
    <Fragment>
      <Container maxW="container.2xl" py={4}>
        <Flex>
          <Box w={"66%"}>
            <Flex align={"center"}>
              <Text fontSize={"2xl"} fontWeight={"bold"}>
                {t("tournaments.tournament")} {" > "}
              </Text>
              <Heading noOfLines={1} fontSize={"2xl"} flex={1}>
                {data.name}
              </Heading>
            </Flex>
            <Flex>
              <Text noOfLines={2}>{data.description}</Text>
              <Spacer />
              <Text
                fontSize={"sm"}
                color={"gray"}
                w={"25%"}
                textAlign={"right"}
              >
                {t("common.created_at")} {formatDate(data.created_at)}
              </Text>
            </Flex>
            <Divider mb={4} borderColor={theme === "dark" ?? "black"} />
            <Box>
              <Flex mb={2} alignItems={"end"}>
                <Text fontSize={"l"} fontWeight={"bold"}>
                  {t("tournaments.scoreboard")}
                </Text>
                <Spacer />
                {Date.now() > new Date(data?.end) ? (
                  <Text>{t("tournaments.has_ended")}</Text>
                ) : userJoin ? (
                  <Button
                    isLoading={isLoading}
                    colorScheme="red"
                    onClick={handleUserLeaveTournament}
                  >
                    <CloseIcon />
                    <Text ml={2}>{t("tournaments.leave")}</Text>
                  </Button>
                ) : (
                  <Button
                    isLoading={isLoading}
                    colorScheme="green"
                    onClick={handleUserJoinTournament}
                  >
                    <AddIcon />
                    <Text ml={2}>{t("tournaments.join")}</Text>
                  </Button>
                )}
                {/* <Button
                  onClick={() => {
                    axios
                      .get(`${appSettings.API_PROXY}/tournament/${id}/pool`)
                      .then((resp) => {
                        alert(resp.data.pool);
                      })
                      .catch(() => {
                        alert("fail");
                      });
                  }}
                >
                  Test Pool
                </Button> */}
              </Flex>
              <Table
                size={{ base: "sm", md: "md" }}
                colorScheme="gray"
                borderRadius={4}
                overflow={"hidden"}
                __css={{ "table-layout": "fixed", width: "full" }}
                variant={"striped"}
              >
                <Thead bgColor={theme === "dark" ? "black" : "gray.200"}>
                  <Tr>
                    <Th width="15%" textAlign={"center"}>
                      {t("common.no")}
                    </Th>
                    <Th width="25%">{t("tournaments.username")}</Th>
                    <Th width="30%">{t("tournaments.name")}</Th>
                    <Th width="15%">{t("tournaments.rating")}</Th>
                    <Th width="15%" textAlign={"right"}>
                      {t("tournaments.point")}
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {scoreboard
                    .slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
                    .map((item, index) => (
                      <Tr key={index} userSelect="none">
                        <Td textAlign={"center"}>
                          {(pageNumber - 1) * pageSize + index + 1}
                        </Td>
                        <Td
                          textAlign={"left"}
                          overflow="hidden"
                          whiteSpace="nowrap"
                          textOverflow="ellipsis"
                        >
                          {item.username}
                        </Td>
                        <Td
                          textAlign={"left"}
                          overflow="hidden"
                          whiteSpace="nowrap"
                          textOverflow="ellipsis"
                        >
                          {item.name}
                        </Td>
                        <Td
                          textAlign={"left"}
                          overflow="hidden"
                          whiteSpace="nowrap"
                          textOverflow="ellipsis"
                        >
                          {Math.floor(item.rating ?? 0)}
                        </Td>
                        <Td
                          textAlign={"right"}
                          overflow="hidden"
                          whiteSpace="nowrap"
                          textOverflow="ellipsis"
                        >
                          {item.score ?? 0}
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Td colSpan={4}>
                      <Flex justify="center" mt={4}>
                        <ButtonGroup>
                          <Button
                            colorScheme="gray"
                            size="sm"
                            onClick={() =>
                              pageNumber - 1 > 0 &&
                              setPageNumber(pageNumber - 1)
                            }
                          >
                            <ChevronLeftIcon />
                          </Button>
                          {Array.from(
                            {
                              length: Math.ceil(scoreboard.length / pageSize),
                            },
                            (_, i) =>
                              pageNumber - 5 <= i &&
                              i <= pageNumber + 3 && (
                                <Button
                                  key={i}
                                  colorScheme={
                                    pageNumber === i + 1 ? "teal" : "gray"
                                  }
                                  size="sm"
                                  onClick={() => setPageNumber(i + 1)}
                                >
                                  {i + 1}
                                </Button>
                              )
                          )}
                          <Button
                            colorScheme="gray"
                            size="sm"
                            onClick={() =>
                              (pageNumber + 1) * pageSize <=
                                scoreboard.length &&
                              setPageNumber(pageNumber + 1)
                            }
                          >
                            <ChevronRightIcon />
                          </Button>
                        </ButtonGroup>
                      </Flex>
                    </Td>
                  </Tr>
                </Tfoot>
              </Table>
            </Box>
          </Box>
          <Spacer />
          <Box w={"30%"} border={"1px solid lightgray"} borderRadius={8} p={4}>
            <Text fontWeight={"bold"}>{t("tournaments.your_games")}</Text>
            {your_games.map((item, index) => (
              <Card
                key={index}
                p={2}
                variant={"outline"}
                borderRadius={4}
                cursor={"pointer"}
                onClick={() => {
                  navigate(`/tournament/game/${item._id}`);
                }}
              >
                <Flex>
                  <Text w={"45%"} textAlign={"left"} noOfLines={1}>
                    {item.white_username ?? ""}
                  </Text>
                  <Text w={"10%"} textAlign={"center"}>
                    -
                  </Text>
                  <Text w={"45%"} textAlign={"left"} noOfLines={1}>
                    {item.black_username ?? ""}
                  </Text>
                </Flex>
              </Card>
            ))}
          </Box>
        </Flex>
      </Container>
    </Fragment>
  );
}
