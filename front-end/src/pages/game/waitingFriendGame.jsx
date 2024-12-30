import {
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Input,
  useClipboard,
} from "@chakra-ui/react";
import React, { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../lib/auth";
import { useCurrentPath } from "../../lib/hooks/route";
import socket from "../../lib/socket";

export default function WaitingFriendGamePage() {
  const path = useCurrentPath();
  const id = path[path.length - 1];
  const navigate = useNavigate();
  const user = getUserData();
  const { t } = useTranslation();
  const { onCopy, value, setValue, hasCopied } = useClipboard("");

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
    setValue(window.location.href);
  }, [id, user?.id, setValue]);

  return (
    <Fragment>
      <Container maxW="container.xl" mt={10} h={"60vh"}>
        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          h={"100%"}
          flexDir={"column"}
        >
          <Card
            borderRadius={8}
            border={1}
            w={{ base: 300, md: 600, lg: 1000 }}
            px={{ base: 8, md: 16, lg: 32 }}
            py={32}
            filter={"auto"}
            brightness={"95%"}
          >
            <Heading as={"h2"} fontSize={"xl"} mb={4}>
              {t("games.send_link_to_your_friend")}
            </Heading>
            <Flex>
              <Input
                placeholder={t("games.game_url")}
                value={value}
                readOnly
                mr={2}
                fontSize={"sm"}
              />
              <Button onClick={onCopy} colorScheme="green">
                {hasCopied ? t("games.copied") : t("games.copy")}
              </Button>
            </Flex>
          </Card>
        </Flex>
      </Container>
    </Fragment>
  );
}
