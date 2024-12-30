import {
  AddIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "../../../lib/axios";
import { formatDate } from "../../../lib/datetime";
import { toast_error, toast_success } from "../../../lib/hooks/toast";
import appSettings from "../../../settings/appSettings";

export default function AdminPuzzlesPage() {
  const theme = localStorage.getItem("theme");
  const toast = useToast();
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [renderData, setRenderData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const pageSize = 10;

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/puzzles`)
      .then((resp) => {
        setData(resp?.data?.puzzles ?? []);
        setRenderData(resp?.data?.puzzles ?? []);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });
  }, [toast, t]);

  const handleGenerate = () => {
    setLoading(true);
    axios
      .get(`${appSettings.API_PROXY}/puzzles/generate-chess`)
      .then((resp) => {
        toast(toast_success(t("common.success")));
        window.location.reload();
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = () => {
    if (!selectedItem) {
      toast(toast_error(t("common.not_found")));
    }
    axios
      .delete(`${appSettings.API_PROXY}/puzzles/${selectedItem._id}`)
      .then((resp) => {
        setRenderData(
          renderData.filter((item) => item._id !== selectedItem._id),
        );
        setData(data.filter((item) => item._id !== selectedItem._id));
        toast(toast_success(t("common.delete_success")));
      })
      .catch((err) => {
        if (err?.response) toast(toast_error(err?.response?.data?.error));
        else toast(toast_error(t("common.something_went_wrong")));
      })
      .finally(() => {
        onClose();
      });
  };

  return (
    <Fragment>
      <Container maxW="container.2xl" py={4}>
        <Flex justify={"space-between"}>
          <Heading fontSize={"xl"} mb={4}>
            {t("puzzles.heading")}
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
                variant={"ghost"}
                onClick={() => {
                  setRenderData(
                    data.filter(
                      (value) =>
                        value?.variant
                          ?.toLowerCase()
                          .includes(searchText.toLowerCase()) ||
                        value?.fen
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
            <Button
              isLoading={loading}
              onClick={handleGenerate}
              colorScheme="green"
              w={32}
            >
              <AddIcon mr={2} /> {t("puzzles.generate")}
            </Button>
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
            <Th width="30%" textAlign={"left"} cursor={"pointer"}>
              {t("puzzles.fen")}
            </Th>
            <Th width="35%" textAlign={"left"} cursor={"pointer"}>
              {t("puzzles.moves")}
            </Th>
            <Th width="10%" cursor={"pointer"}>
              {t("common.created_at")}
            </Th>
            <Th width="15%" textAlign={"center"} cursor={"pointer"}>
              {t("common.action")}
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
                  {item.fen}
                </Td>
                <Td
                  textAlign={"left"}
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                >
                  {item.moves.join(" ")}
                </Td>
                <Td
                  textAlign={"left"}
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                >
                  {formatDate(item.created_at)}
                </Td>
                <Td>
                  <Flex justifyContent={"center"}>
                    <Button
                      colorScheme="red"
                      onClick={() => {
                        setSelectedItem(item);
                        onOpen();
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  </Flex>
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

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("common.confirm")}
            </AlertDialogHeader>

            <AlertDialogBody>
              {t("common.confirm_delete_question")}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                {t("common.cancel")}
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                {t("common.delete")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Fragment>
  );
}
