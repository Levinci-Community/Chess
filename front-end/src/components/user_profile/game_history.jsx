import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import appSettings from "../../settings/appSettings";
import axios from "../../lib/axios";

function GameHistory({ userId }) {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/player/${userId}/history`)
      .then((response) => {
        setHistory(response.data);
        console.log("Game history:", response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch game history:", error);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <Center py={6}>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        {t("history.heading")}
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>{t("history.opponent")}</Th>
            <Th>{t("history.date")}</Th>
            <Th>{t("history.result")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {history.map((game, index) => (
            <Tr key={index}>
              <Td>{game.opponent}</Td>
              <Td>{new Date(game.timestamp).toLocaleDateString()}</Td>
              <Td>{game.result}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default GameHistory;
