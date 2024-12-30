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
  Spacer,
  Spinner,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LeftNav from "../../components/nav/leftNav";
import axios from "../../lib/axios";
import { toast_error } from "../../lib/hooks/toast";
import appSettings from "../../settings/appSettings";

export default function AdmingamesPage() {
  const navigate = useNavigate();
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
      .get(`${appSettings.API_PROXY}/games/tv`)
      .then((resp) => {
        setData(resp?.data?.games ?? []);
        setRenderData(resp?.data?.games ?? []);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });
  }, [toast, t]);

  return (
    <Container maxW="container.2xl" py={4}>
      <Flex>
        <Box
          w={{ base: "0%", md: "24%" }}
          display={{ base: "none", md: "block" }}
        >
          <LeftNav />
        </Box>
        <Spacer />
        <Box w={{ base: "100%", md: "74%" }}>
          <Flex justify={"space-between"}>
            <Heading fontSize={"xl"} mb={4}>
              {t("games.games")}
            </Heading>
            <Flex>
              <Box position={"relative"}>
                <Input
                  colorScheme="gray"
                  placeholder={t("common.search")}
                  onChange={(e) => {
                    setSearchText(e?.target?.value ?? "");
                  }}
                  w={300}
                />
                <Button
                  position={"absolute"}
                  top={0}
                  right={0}
                  zIndex={1}
                  colorScheme="gray"
                  onClick={() => {
                    setRenderData(
                      data.filter(
                        (value) =>
                          value?.white_username
                            ?.toLowerCase()
                            .includes(searchText.toLowerCase()) ||
                          value?.black_username
                            ?.toLowerCase()
                            .includes(searchText.toLowerCase()),
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

          {renderData?.length > 0 ? (
            <Table
              mt={4}
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
                  <Th width="25%" cursor={"pointer"}>
                    {t("games.white")}
                  </Th>
                  <Th width="25%" cursor={"pointer"}>
                    {t("games.black")}
                  </Th>
                  <Th width="20%" textAlign={"center"} cursor={"pointer"}>
                    {t("common.variant")}
                  </Th>
                  <Th width="20%" textAlign={"center"} cursor={"pointer"}>
                    {t("common.time")}
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {renderData
                  .slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
                  .map((item, index) => (
                    <Tr
                      key={index}
                      userSelect="none"
                      cursor="pointer"
                      onClick={() => navigate(`/online/${item._id}`)}
                    >
                      <Td textAlign={"center"}>
                        {(pageNumber - 1) * pageSize + index + 1}
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
                        textAlign={"center"}
                        overflow="hidden"
                        whiteSpace="nowrap"
                        textOverflow="ellipsis"
                      >
                        {item.variant}
                      </Td>
                      <Td
                        textAlign={"center"}
                      >{`${item.initial_time} + ${item.bonus_time}`}</Td>
                    </Tr>
                  ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Td colSpan={5}>
                    <Flex justify="center" mt={4}>
                      <ButtonGroup>
                        <Button
                          colorScheme="gray"
                          size="sm"
                          onClick={() =>
                            pageNumber - 1 > 0 && setPageNumber(pageNumber - 1)
                          }
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
                                colorScheme={
                                  pageNumber === i + 1 ? "teal" : "gray"
                                }
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
                        >
                          <ChevronRightIcon />
                        </Button>
                      </ButtonGroup>
                    </Flex>
                  </Td>
                </Tr>
              </Tfoot>
            </Table>
          ) : (
            <Spinner />
          )}
        </Box>
      </Flex>
    </Container>
  );
}
