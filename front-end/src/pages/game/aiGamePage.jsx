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
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import AiChessBoard from "../../components/game/aiChessBoard";
import Timer from "../../components/game/timer";
import { getUserData } from "../../lib/auth";
import axios from "../../lib/axios";
import { useCurrentPath } from "../../lib/hooks/route";
import { toast_error } from "../../lib/hooks/toast";
import appSettings from "../../settings/appSettings";

export default function AiGamePage() {
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
  const [isViewer, setIsViewer] = useState(true);

  const toggleTurn = useCallback(() => {
    setYou((prevYou) => ({ ...prevYou, is_turn: !prevYou.is_turn }));
    setOpponent((prevOpponent) => ({
      ...prevOpponent,
      is_turn: !prevOpponent.is_turn,
    }));
  }, []);
  const whiteTime = useMemo(
    () => (user.id === game?.white ? yourTime : opponentTime),
    [user.id, game?.white, yourTime, opponentTime],
  );
  const blackTime = useMemo(
    () => (user.id === game?.black ? yourTime : opponentTime),
    [user.id, game?.black, yourTime, opponentTime],
  );

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/ai-game/${id}`)
      .then((res) => {
        const gameData = res.data;
        setGame(gameData);
        setGameStatus("started");
      })
      .catch((err) => {
        toast(toast_error("common.error"));
        console.log(err);
      });
  }, [id, toast, user.id]);

  const handleResign = useCallback(async () => {
    try {
      await axios.put(`${appSettings.API_PROXY}/ai-game/${id}/resign`);
      setGameStatus("ended");
    } catch {
      toast(toast_error("common.error"));
    }
  }, []);

  return (
    <Fragment>
      <Container maxW="6xl" mt={4}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box w={{ base: "100%", md: "66%" }} mb={{ base: 8, md: 0 }} pt={4}>
            <AiChessBoard
              game={game}
              setGameStatus={setGameStatus}
              toggleBaseTurn={toggleTurn}
              gameStatus={gameStatus}
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
                @{t("game.ai")}
              </Text>
              <Heading fontSize="xl">{opponent.name}</Heading>
              <Timer
                game={game}
                isActive={false}
                setUserTime={setOpponentTime}
                isAi={true}
              />
              <Spacer />
              <HStack>
                <Button
                  w={120}
                  colorScheme="red"
                  onClick={handleResign}
                  isDisabled={gameStatus !== "started"}
                >
                  {t("games.resign")}
                </Button>
              </HStack>
              <Spacer />
              <Timer
                game={game}
                isActive={false}
                setUserTime={setYourTime}
                isAi={true}
              />
              <Heading fontSize="xl">{you.name}</Heading>
              <Text color="gray.500" fontSize="md">
                @{t("game.you")}
              </Text>
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Fragment>
  );
}
