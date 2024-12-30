import { Box, Card, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaGamepad } from "react-icons/fa";
import AiLevelChart from "./gameReport/aiLevelChart";
import TimeChart from "./gameReport/timeChart";
import VariantChart from "./gameReport/variantChart";
import WinnerChart from "./gameReport/winnerChart";
import WinrateChart from "./gameReport/winrate";

export default function GameReport({ online, offline }) {
  const { t } = useTranslation();
  const theme = localStorage.getItem("theme");
  return (
    <Card
      filter="auto"
      brightness="98%"
      p={1}
      variant={"outline"}
      overflow={"hidden"}
      borderRadius={4}
      mb={2}
      minH={120}
    >
      <Heading
        as={"h5"}
        fontSize={"md"}
        display={"flex"}
        alignItems={"center"}
        mb={1}
      >
        <FaGamepad style={{ marginRight: 4 }} />
        {t("dashboard.game_report")}
      </Heading>
      <Flex w={"100%"}>
        <Box w={"50%"}>
          <Text fontSize={"sm"} fontWeight={"bold"}>
            {t("dashboard.online")}
          </Text>
          <Text fontSize={"4xl"} fontWeight={"bold"} textAlign={"left"}>
            {online?.count}
          </Text>
        </Box>
      </Flex>
      <Flex>
        <Box w={"33%"}>
          <VariantChart theme={theme} data={online?.variant} />
        </Box>
        <Box w={"33%"}>
          <WinrateChart theme={theme} data={online?.status} />
        </Box>
        <Box w={"33%"}>
          <TimeChart theme={theme} data={online?.time} />
        </Box>
      </Flex>
      <Flex w={"100%"}>
        <Box w={"50%"}>
          <Text fontSize={"sm"} fontWeight={"bold"}>
            {t("dashboard.offline")}
          </Text>
          <Text fontSize={"4xl"} fontWeight={"bold"} textAlign={"left"}>
            {offline?.count}
          </Text>
        </Box>
      </Flex>
      <Flex>
        <Box w={"33%"}>
          <VariantChart theme={theme} data={offline?.variant} />
        </Box>
        <Box w={"33%"}>
          <WinrateChart theme={theme} data={offline?.status} />
        </Box>
        <Box w={"33%"}>
          <TimeChart theme={theme} data={offline?.time} />
        </Box>
      </Flex>
      <Flex>
        <Box w={"33%"}>
          <AiLevelChart theme={theme} data={offline?.ai_level} />
        </Box>
        <Box w={"33%"}>
          <WinnerChart theme={theme} data={offline?.winner} />
        </Box>
      </Flex>
    </Card>
  );
}
