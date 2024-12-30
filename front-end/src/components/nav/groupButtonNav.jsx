import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaChessQueen, FaDonate, FaPuzzlePiece } from "react-icons/fa";
import { FaDisplay } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
export default function GroupButtonNav() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Box>
      <Flex mt={4} justifyContent={"space-between"}>
        <Button
          title={t("club.play")}
          onClick={() => navigate("/new-game")}
          w={"48%"}
          h={32}
          variant={"outline"}
          colorScheme="gray"
          leftIcon={<FaChessQueen size={32} />}
        >
          <Text textTransform={"uppercase"} fontSize={"lg"}>
            {t("club.play")}
          </Text>
        </Button>
        <Button
          title={t("club.puzzle")}
          onClick={() => navigate("/puzzle")}
          w={"48%"}
          h={32}
          variant={"outline"}
          colorScheme="gray"
          leftIcon={<FaPuzzlePiece size={32} />}
        >
          <Text textTransform={"uppercase"} fontSize={"lg"}>
            {t("club.puzzle")}
          </Text>
        </Button>
      </Flex>
      <Flex mt={4} justifyContent={"space-between"}>
        <Button
          title={t("club.donate")}
          onClick={() => navigate("/donate")}
          w={"48%"}
          h={32}
          variant={"outline"}
          colorScheme="gray"
          leftIcon={<FaDonate size={32} />}
        >
          <Text textTransform={"uppercase"} fontSize={"lg"}>
            {t("club.donate")}
          </Text>
        </Button>
        <Button
          title={t("club.tv")}
          onClick={() => navigate("/tv")}
          w={"48%"}
          h={32}
          variant={"outline"}
          colorScheme="gray"
          leftIcon={<FaDisplay size={32} />}
        >
          <Text textTransform={"uppercase"} fontSize={"lg"}>
            {t("club.tv")}
          </Text>
        </Button>
      </Flex>
    </Box>
  );
}
