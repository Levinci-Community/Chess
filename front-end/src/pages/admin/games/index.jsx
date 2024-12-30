import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  Heading,
  Input,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "../../../lib/axios";
import { toast_error } from "../../../lib/hooks/toast";
import appSettings from "../../../settings/appSettings";

export default function AdminGamesPage() {
  const theme = localStorage.getItem("theme");
  const toast = useToast();
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [renderData, setRenderData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = React.useState(1);
  const pageSize = 10;

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/games`)
      .then((resp) => {
        setData(resp?.data?.games ?? []);
        setRenderData(resp?.data?.games ?? []);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });
  }, [toast, t]);

  return (
    <Fragment>
      <Container maxW="container.2xl" py={4}>
        <Flex justify={"space-between"}>
          <Heading fontSize={"xl"} mb={4}>
            {t("games.heading")}
          </Heading>
          <Flex>
            <Box position={"relative"} mr={4}>
              <Input
                colorScheme="gray"
                placeholder={t("common.search")}
                onChange={(e) => {
                  setSearchText(e?.target?.value ?? "");
                }}
              />
              <Button
                position={"absolute"}
                top={0}
                right={0}
                zIndex={1}
                onClick={() => {
                  setRenderData(
                    data.filter(
                      (value) =>
                        value?.white
                          ?.toLowerCase()
                          .includes(searchText.toLowerCase()) ||
                        value?.black
                          ?.toLowerCase()
                          .includes(searchText.toLocaleLowerCase()) ||
                        value?.variant
                          ?.toLowerCase()
                          .includes(searchText.toLowerCase()) ||
                        value?.status
                          ?.toLowerCase()
                          .includes(searchText.toLocaleLowerCase()),
                    ),
                  );
                }}
                title="search"
              >
                <SearchIcon />
              </Button>
            </Box>
          </Flex>
        </Flex>
      </Container>

      <Table
        size={{ base: "sm", md: "md" }}
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
            <Th width="10%" cursor={"pointer"}>
              {t("common.variant")}
            </Th>
            <Th width="20%" textAlign={"left"} cursor={"pointer"}>
              {t("games.time")}
            </Th>
            <Th width="25%" textAlign={"left"} cursor={"pointer"}>
              {t("games.white")}
            </Th>
            <Th width="25%" textAlign={"left"} cursor={"pointer"}>
              {t("games.black")}
            </Th>
            <Th width="10%" cursor={"pointer"}>
              {t("common.status")}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {renderData
            .slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
            .map((item, index) => (
              <Tr key={index} userSelect="none" cursor="pointer">
                <Td textAlign={"center"}>
                  {(pageNumber - 1) * pageSize + index + 1}
                </Td>
                <Td
                  textAlign={"left"}
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                >
                  {item.variant}
                </Td>
                <Td
                  textAlign={"left"}
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                >
                  {`${item.initial_time} + ${item.bonus_time}`}
                </Td>
                <Td
                  textAlign={"left"}
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                >
                  {item.white_username}
                </Td>
                <Td
                  textAlign={"left"}
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                >
                  {item.black_username}
                </Td>
                <Td
                  textAlign={"left"}
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                >
                  {item.status}
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
    </Fragment>
  );
}
