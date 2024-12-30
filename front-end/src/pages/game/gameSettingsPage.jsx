import {
  Box,
  Button,
  Container,
  Flex,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaRobot, FaUserFriends } from "react-icons/fa";
import { RiGlobalLine } from "react-icons/ri";
import NewOnlineGameModal from "../../components/game/newGameModal";
import NoLogicChessBoard from "../../components/game/noLogicChessBoard";
import GroupButtonNav from "../../components/nav/groupButtonNav";
import LeftNav from "../../components/nav/leftNav";
import UpdateVipNow from "../../components/vip/updateVipNow";
import { FRIEND, OFFLINE, ONLINE } from "../../settings/game";

export default function GameSettingsPage({ user }) {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [gameMode, setGameMode] = useState("online");
  return (
    <Fragment>
      <NewOnlineGameModal
        isOpen={isOpen}
        onClose={onClose}
        mode={gameMode}
        is_vip={user?.is_vip}
      />
      <Container maxW="container.2xl" py={4}>
        <Flex direction={{ base: "column", md: "row" }}>
          <Box
            w={{ base: "0%", md: "24%" }}
            display={{ base: "none", md: "block" }}
          >
            <LeftNav />
          </Box>
          <Spacer />
          <Box
            display={{ base: "none", md: "block" }}
            w={{ base: "100%", md: "48%" }}
            mb={{ base: 8, md: 0 }}
          >
            <NoLogicChessBoard isFree={true} />
          </Box>

          <Spacer display={{ base: "none", md: "block" }} />

          <Box w={{ base: "100%", md: "24%" }}>
            <UpdateVipNow />
            <Text mb={4}>{t("games.game_action")}</Text>
            <Box borderRadius={4} border={"1px solid gray"} p={4}>
              <Button
                w="100%"
                colorScheme="gray"
                onClick={() => {
                  setGameMode(ONLINE);
                  onOpen();
                }}
                leftIcon={<RiGlobalLine />}
              >
                {t("games.play_online")}
              </Button>
              <Button
                w="100%"
                mt={4}
                colorScheme="gray"
                onClick={() => {
                  setGameMode(FRIEND);
                  onOpen();
                }}
                leftIcon={<FaUserFriends />}
              >
                {t("games.play_friend")}
              </Button>
              <Button
                w="100%"
                mt={4}
                colorScheme="gray"
                onClick={() => {
                  setGameMode(OFFLINE);
                  onOpen();
                }}
                leftIcon={<FaRobot />}
              >
                {t("games.play_bot")}
              </Button>
            </Box>
            <GroupButtonNav />
          </Box>
        </Flex>
      </Container>
    </Fragment>
  );
}
