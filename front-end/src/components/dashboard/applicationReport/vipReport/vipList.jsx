import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function VipList({ data }) {
  const theme = localStorage.getItem("theme");
  const { t } = useTranslation();
  const [renderData, setRenderData] = useState([]);
  const [pageNumber, setPageNumber] = React.useState(1);
  const pageSize = 5;

  useEffect(() => {
    setRenderData(data ?? []);
  }, [data]);

  return (
    <Box>
      <Table
        size="sm"
        colorScheme="gray"
        borderRadius={4}
        overflow={"hidden"}
        __css={{ "table-layout": "fixed", width: "full" }}
        variant={"striped"}
      >
        <Thead bgColor={theme === "dark" ? "black" : "gray.200"}>
          <Tr>
            <Th width="10%" textAlign={"center"}>
              {t("common.no")}
            </Th>
            <Th width="40%" cursor={"pointer"}>
              {t("dashboard.username")}
            </Th>
            <Th width="50%" cursor={"pointer"}>
              {t("dashboard.email")}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {renderData
            .slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
            .map((item, index) => (
              <Tr key={index}>
                <Td textAlign={"center"}>
                  {(pageNumber - 1) * pageSize + index + 1}
                </Td>
                <Td
                  textAlign={"left"}
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                >
                  {item.username}{" "}
                </Td>
                <Td
                  textAlign={"left"}
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                >
                  {item.email}{" "}
                </Td>
              </Tr>
            ))}
        </Tbody>
        <Tfoot>
          <Tr>
            <Td colSpan={6}>
              <Flex justify="center" mt={4}>
                <ButtonGroup>
                  <Button
                    colorScheme="gray"
                    size="sm"
                    onClick={() =>
                      pageNumber - 1 > 0 && setPageNumber(pageNumber - 1)
                    }
                    title="left"
                  >
                    <ChevronLeftIcon />
                  </Button>
                  {Array.from(
                    { length: Math.ceil(renderData.length / pageSize) },
                    (_, i) =>
                      pageNumber - 5 <= i &&
                      i <= pageNumber + 3 && (
                        <Button
                          key={i}
                          colorScheme={pageNumber === i + 1 ? "teal" : "gray"}
                          size="sm"
                          onClick={() => setPageNumber(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ),
                  )}
                  <Button
                    colorScheme="gray"
                    size="sm"
                    onClick={() =>
                      (pageNumber + 1) * pageSize <= renderData.length &&
                      setPageNumber(pageNumber + 1)
                    }
                    title="right"
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
  );
}
