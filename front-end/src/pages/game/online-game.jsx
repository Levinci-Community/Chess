import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Spacer,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import ChessBoard from "../../components/game/chessBoard";
import Timer from "../../components/game/timer";
import { getUserData } from "../../lib/auth";
import axios from "../../lib/axios";
import { useCurrentPath } from "../../lib/hooks/route";
import { toast_error, toast_info } from "../../lib/hooks/toast";
import socket from "../../lib/socket";
import appSettings from "../../settings/appSettings";

export default function OnlineGamePage() {
  const user = getUserData() ?? { id: "" };
  const path = useCurrentPath();
  const id = path[path.length - 1];
  const { t } = useTranslation();
  const toast = useToast();

  const [game, setGame] = useState({
    initial_time: 10,
    bonus_time: 0,
    white: "white",
    black: "black",
    white_player: { username: "white" },
    black_player: { username: "black" },
  });

  const [gameStatus, setGameStatus] = useState("ended");
  const [isOfferDraw, setIsOfferDraw] = useState(false);
  const [isViewer, setIsViewer] = useState(true);
  const [you, setYou] = useState({
    id: "you",
    username: "you",
    name: "You",
    is_turn: false,
  });
  const [yourTime, setYourTime] = useState(100);

  const [opponent, setOpponent] = useState({
    id: "opponent",
    username: "opponent",
    name: "Opponent",
    is_turn: false,
  });
  const [opponentTime, setOpponentTime] = useState(100);

  const toggleTurn = useCallback(() => {
    setYou((prevYou) => ({ ...prevYou, is_turn: !prevYou.is_turn }));
    setOpponent((prevOpponent) => ({
      ...prevOpponent,
      is_turn: !prevOpponent.is_turn,
    }));
  }, []);
  const whiteTime = useMemo(
    () => (user.id === game?.white ? yourTime : opponentTime),
    [user.id, game?.white, yourTime, opponentTime]
  );
  const blackTime = useMemo(
    () => (user.id === game?.black ? yourTime : opponentTime),
    [user.id, game?.black, yourTime, opponentTime]
  );

  const handleGameReady = useCallback(
    (data) => {
      if (data && data.game_id === id && gameStatus !== "started") {
        if (data && data.data && data.data.fen) {
          const fen = data.data.fen;
          const turn = fen.includes("w") ? "white" : "black";
          if (turn === "black") toggleTurn();
          // const yourColor = game.white === you.id ? "white" : "black";
          // if (yourColor === "white") {
          //   setYourTime(data?.data?.whiteTime ?? 0);
          //   setOpponentTime(data?.data?.blackTime ?? 0);
          // } else {
          //   setOpponentTime(data?.data?.whiteTime ?? 0);
          //   setYourTime(data?.data?.blackTime ?? 0);
          // }
          setGame((g) => ({ ...g, fen: fen }));
        }
        if (data.status === "STARTED") {
          setGameStatus("started");
          console.log("game_started");
        } else {
          setGameStatus("ended");
          console.log("game_loaded");
        }
      }
    },
    [id, gameStatus, toggleTurn]
  );

  const handleOfferDraw = useCallback(
    (data) => {
      if (
        data &&
        data.game_id === id &&
        gameStatus === "started" &&
        data.player_offer_id === opponent?.id
      ) {
        toast(
          toast_info(
            t("games.offer_draw_sent"),
            t("games.your_opponent_offer_draw")
          )
        );
        setIsOfferDraw(true);
        console.log("offer_draw");
      }
    },
    [id, gameStatus, toast, t, opponent?.id]
  );

  const handleAcceptDraw = useCallback(
    (data) => {
      if (data && data.game_id === id && gameStatus === "started") {
        if (data.player_accept_id === opponent?.id && !isViewer) {
          toast(
            toast_info(
              t("games.offer_draw_accepted"),
              t("games.your_opponent_accept_offer_draw")
            )
          );
        }
        setGameStatus("ended");
        console.log("accept_draw");
      }
    },
    [id, gameStatus, opponent?.id, toast, t, isViewer]
  );

  const handleRejectDraw = useCallback(
    (data) => {
      if (
        data &&
        data.game_id === id &&
        gameStatus === "started" &&
        data.player_reject_id === opponent?.id &&
        !isViewer
      ) {
        toast(
          toast_info(
            t("games.offer_draw_rejected"),
            t("games.your_opponent_reject_offer_draw")
          )
        );
        console.log("reject_draw");
      }
    },
    [id, gameStatus, opponent?.id, toast, t, isViewer]
  );

  const handleResign = useCallback(
    (data) => {
      if (data && data.game_id === id && gameStatus === "started") {
        if (data.player_resign_id === opponent?.id && !isViewer) {
          toast(toast_info(t("games.resign"), t("games.your_opponent_resign")));
        }
        setGameStatus("ended");
        console.log("resign");
      }
    },
    [id, gameStatus, opponent?.id, toast, t, isViewer]
  );

  const handleTimeout = useCallback(
    (data) => {
      if (data && data.game_id === id && gameStatus === "started") {
        if (data.player_timeout_id === opponent?.id && !isViewer) {
          toast(
            toast_info(t("games.timeout"), t("games.your_opponent_timeout"))
          );
        }
        setGameStatus("ended");
        console.log("timeout");
      }
    },
    [id, gameStatus, opponent?.id, toast, t, isViewer]
  );

  const handleCheckMate = useCallback(
    (data) => {
      if (data && data.game_id === id && gameStatus === "started") {
        toast(
          toast_info(t("games.checkmate"), t("games.game_stop_by_checkmate"))
        );
        setGameStatus("ended");
        console.log("checkmate");
      }
    },
    [id, gameStatus, toast, t]
  );
  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/game/${id}&mode=online`)
      .then((res) => {
        const gameData = res.data;
        setGame(gameData);
        console.log(gameData);
        setGameStatus(gameData?.status?.toLowerCase() ?? "ended");
        const isNotPlayer = !(
          user?.id === gameData.white || user?.id === gameData.black
        );
        setIsViewer(isNotPlayer);
        if (isNotPlayer) {
          setYou({ ...gameData.white_player, is_turn: true });
          setOpponent({ ...gameData.black_player, is_turn: false });
        } else {
          setYou((prevYou) =>
            user.id === gameData.white
              ? { ...gameData.white_player, is_turn: true }
              : { ...gameData.black_player, is_turn: false }
          );
          setOpponent((prevOpponent) =>
            user.id === gameData.white
              ? { ...gameData.black_player, is_turn: false }
              : { ...gameData.white_player, is_turn: true }
          );
        }
        if (!gameData.png) {
          socket.emit("join_game", { game_id: id });
        }
      })
      .catch((err) => {
        toast(toast_error("Error", "Failed to load game"));
        console.log(err);
      });
  }, [id, toast, user.id]);

  useEffect(() => {
    socket.connect();

    socket.on("game_start", handleGameReady);
    socket.on("offer_draw", handleOfferDraw);
    socket.on("accept_draw", handleAcceptDraw);
    socket.on("reject_draw", handleRejectDraw);
    socket.on("resign", handleResign);
    socket.on("timeout", handleTimeout);
    socket.on("checkmate", handleCheckMate);

    return () => {
      socket.off("game_start", handleGameReady);
      socket.off("offer_draw", handleOfferDraw);
      socket.off("accept_draw", handleAcceptDraw);
      socket.off("reject_draw", handleRejectDraw);
      socket.off("resign", handleResign);
      socket.off("timeout", handleTimeout);
      socket.off("checkmate", handleCheckMate);
      if (socket.readyState === 1) {
        socket.disconnect();
      }
    };
  }, [
    handleAcceptDraw,
    handleRejectDraw,
    handleResign,
    handleTimeout,
    handleGameReady,
    handleCheckMate,
    handleOfferDraw,
  ]);

  return (
    <Fragment>
      <Container maxW="6xl" mt={4}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box w={{ base: "100%", md: "66%" }} mb={{ base: 8, md: 0 }} pt={4}>
            <ChessBoard
              game={game}
              setGameStatus={setGameStatus}
              toggleBaseTurn={toggleTurn}
              isViewer={isViewer}
              whiteTime={whiteTime}
              blackTime={blackTime}
            />
          </Box>

          <Spacer display={{ base: "none", md: "block" }} />

          <Box
            w={{ base: "100%", md: "30%" }}
            h={{ base: 300, sm: 400, md: 500, lg: 500 }}
            border={"1px solid lightgray"}
            borderRadius={4}
            p={4}
          >
            <VStack h={"100%"} py={12}>
              <Text color="gray.500" fontSize="md">
                @{opponent.username}
              </Text>
              <Heading fontSize="xl">{opponent.name}</Heading>
              <Timer
                game={game}
                isActive={gameStatus === "started" && opponent.is_turn}
                onTimeout={() => {
                  setGameStatus("ended");
                  socket.emit("timeout", {
                    game_id: id,
                    player_timeout_id: opponent?.id,
                  });
                  toast(toast_info(t("games.timeout")));
                }}
                setUserTime={setOpponentTime}
              />
              <Spacer />
              <HStack>
                {(user?.id === you.id || user?.id === opponent.id) &&
                  (isOfferDraw ? (
                    <>
                      <Button
                        w={120}
                        colorScheme="orange"
                        onClick={() => {
                          socket.emit("accept_draw", {
                            game_id: id,
                            player_accept_id: user?.id,
                          });
                          setIsOfferDraw(false);
                          setGameStatus("ended");
                          toast(
                            toast_info(
                              t("games.accept_draw"),
                              t("games.you_send_accept_draw")
                            )
                          );
                        }}
                        isDisabled={gameStatus !== "started"}
                      >
                        {t("games.accept_draw")}
                      </Button>
                      <Spacer />
                      <Button
                        w={120}
                        colorScheme="gray"
                        onClick={() => {
                          socket.emit("reject_draw", {
                            game_id: id,
                            player_reject_id: user?.id,
                          });
                          setIsOfferDraw(false);
                          toast(
                            toast_info(
                              t("games.reject_draw"),
                              t("games.you_send_reject_draw")
                            )
                          );
                        }}
                        isDisabled={gameStatus !== "started"}
                      >
                        {t("games.reject_draw")}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        w={120}
                        colorScheme="yellow"
                        onClick={() => {
                          socket.emit("offer_draw", {
                            game_id: id,
                            player_offer_id: user?.id,
                          });
                          toast(
                            toast_info(
                              t("games.offer_draw"),
                              t("games.you_send_offer_draw")
                            )
                          );
                        }}
                        isDisabled={gameStatus !== "started"}
                      >
                        {t("games.offer_draw")}
                      </Button>
                      <Spacer />
                      <Button
                        w={120}
                        colorScheme="red"
                        onClick={() => {
                          socket.emit("resign", {
                            game_id: id,
                            player_resign_id: user?.id,
                          });
                          toast(
                            toast_info(t("games.resign"), t("games.you_resign"))
                          );
                        }}
                        isDisabled={gameStatus !== "started"}
                      >
                        {t("games.resign")}
                      </Button>
                    </>
                  ))}
              </HStack>
              <Spacer />
              <Timer
                game={game}
                isActive={gameStatus === "started" && you.is_turn}
                onTimeout={() => {
                  setGameStatus("ended");
                  socket.emit("timeout", {
                    game_id: id,
                    player_timeout_id: you?.id,
                  });
                }}
                setUserTime={setYourTime}
              />
              <Heading fontSize="xl">{you.name}</Heading>
              <Text color="gray.500" fontSize="md">
                @{you.username}
              </Text>
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Fragment>
  );
}
