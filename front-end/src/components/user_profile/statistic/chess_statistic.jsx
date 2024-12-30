import { Box, Flex, Spacer } from "@chakra-ui/react";
import Stats from "./stats";
import { useTranslation } from "react-i18next";

export default function ChessStatistics(props) {
  const { t } = useTranslation();
  const { elo, game } = props.data;

  return (
    <Flex>
      <Box p={2} borderRadius={4} border="lightgray 1px solid" w="48%">
        <Stats
          label={`${t("profile.chess")} ${t("profile.elo")}`}
          oldValue={elo.last_month}
          newValue={elo.current_month}
        />
      </Box>
      <Spacer />
      <Box p={2} borderRadius={4} border="lightgray 1px solid" w="48%">
        <Stats
          label={t("profile.no_game")}
          oldValue={game.last_month}
          newValue={game.current_month}
        />
      </Box>
    </Flex>
  );
}
