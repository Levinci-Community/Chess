import {
  AddIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
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
import { useNavigate } from "react-router-dom";
import axios from "../../../lib/axios";
import { formatDate } from "../../../lib/datetime";
import { toast_error, toast_success } from "../../../lib/hooks/toast";
import appSettings from "../../../settings/appSettings";

export default function AdminAchievementsPage() {
  const navigate = useNavigate();
  const theme = localStorage.getItem("theme");
  const toast = useToast();
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [data, setData] = useState([]);
  const [renderData, setRenderData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const pageSize = 10;

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/achievements`)
      .then((resp) => {
        setData(resp?.data?.achievements ?? []);
        setRenderData(resp?.data?.achievements ?? []);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });
  }, [toast, t]);

  const handleDelete = () => {
    if (!selectedItem) {
      toast(toast_error(t("common.not_found")));
    }
    axios
      .delete(`${appSettings.API_PROXY}/achievements/${selectedItem._id}`)
      .then((resp) => {
        setRenderData(
          renderData.filter((item) => item._id !== selectedItem._id),
        );
        setData(data.filter((item) => item._id !== selectedItem._id));
        toast(toast_success(t("common.delete_success")));
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
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
            {t("achievements.heading")}
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
                        value?.event
                          ?.toLowerCase()
                          .includes(searchText.toLowerCase()) ||
                        value?.member
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
              onClick={() => {
                navigate("/admin/create-achievement");
              }}
              colorScheme="green"
              w={32}
            >
              <AddIcon mr={2} /> {t("common.new")}
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
            <Th width="25%" cursor={"pointer"}>
              {t("achievements.event")}
            </Th>
            <Th width="20%" textAlign={"left"} cursor={"pointer"}>
              {t("achievements.member")}
            </Th>
            <Th width="20%" textAlign={"left"} cursor={"pointer"}>
              {t("achievements.reward")}
            </Th>
            <Th width="10%" cursor={"pointer"}>
              {t("achievements.time")}
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
                  {item.event}
                </Td>
                <Td
                  textAlign={"left"}
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                >
                  {item.member}
                </Td>
                <Td
                  textAlign={"left"}
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                >
                  {item.reward}
                </Td>
                <Td
                  textAlign={"left"}
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                >
                  {formatDate(item.time)}
                </Td>
                <Td>
                  <Flex justifyContent={"center"}>
                    <Button
                      onClick={() =>
                        navigate(`/admin/update-achievement/${item._id}`)
                      }
                      colorScheme="yellow"
                      mr={2}
                    >
                      <EditIcon />
                    </Button>
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
