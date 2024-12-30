import { Container, Flex, Heading, Spinner } from "@chakra-ui/react";
import React, { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../lib/auth";
import { useCurrentPath } from "../../lib/hooks/route";
import socket from "../../lib/socket";

export default function WaitingGamePage() {
  const path = useCurrentPath();
  const id = path[path.length - 1];
  const navigate = useNavigate();
  const user = getUserData();
  const { t } = useTranslation();

  useEffect(() => {
    // Connect socket when component mounts
    socket.connect();

    // Subscribe to socket event for game readiness
    const handleGameReady = (data) => {
      const { game, lobby_id } = data;
      if (lobby_id !== id) return;
      socket.disconnect();
      navigate(`/online/${game._id}`);
      console.log("game_ready");
    };

    socket.on("game_ready", handleGameReady);

    return () => {
      socket.off("game_ready", handleGameReady);
      if (socket.readyState === 1) {
        socket.disconnect();
      }
    };
  }, [id, navigate]);

  useEffect(() => {
    // Emit request for game
    socket.emit("request_game", {
      lobby_id: id,
      user_id: user?.id,
    });
    console.log("request_game");
  }, [id, user?.id]);

  return (
    <Fragment>
      <Container maxW="container.xl" mt={10}>
        <Heading as="h1" size="lg" mb={5} textAlign={"center"}>
          {t("games.waiting_for_another")}
        </Heading>
        <Flex justify={"center"} align={"center"}>
          <Spinner size="xl" />
        </Flex>
      </Container>
    </Fragment>
  );
}
