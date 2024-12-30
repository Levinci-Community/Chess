import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  LockIcon,
  SearchIcon,
  UnlockIcon,
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
import { toast_error, toast_success } from "../../../lib/hooks/toast";
import appSettings from "../../../settings/appSettings";

export default function AdminUsersPage() {
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
      .get(`${appSettings.API_PROXY}/users`)
      .then((resp) => {
        setData(resp?.data?.users ?? []);
        setRenderData(resp?.data?.users ?? []);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });
  }, [toast, t]);

  const handleToggleAccountStatus = () => {
    if (!selectedItem) {
      toast(toast_error(t("common.not_found")));
    }
    axios
      .put(`${appSettings.API_PROXY}/users/${selectedItem.id}/status`)
      .then((resp) => {
        setRenderData(
          renderData.map((item) => {
            if (item.id === selectedItem.id) {
              return {
                ...item,
                is_locked: !item.is_locked,
              };
            }
            return item;
          }),
        );
        setData(
          data.map((item) => {
            if (item.id === selectedItem.id) {
              return {
                ...item,
                is_locked: !item.is_locked,
              };
            }
            return item;
          }),
        );
        toast(toast_success(t("common.success")));
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
            {t("users.heading")}
          </Heading>
          <Flex>
            <Box position={"relative"} mr={4}>
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
                colorScheme="teal"
                onClick={() => {
                  setRenderData(
                    data.filter(
                      (value) =>
                        value?.username
                          ?.toLowerCase()
                          .includes(searchText.toLowerCase()) ||
                        value?.email
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
            <Th width="20%" cursor={"pointer"}>
              {t("users.username")}
            </Th>
            <Th width="20%" textAlign={"left"} cursor={"pointer"}>
              {t("users.email")}
            </Th>
            <Th width="20%" textAlign={"left"} cursor={"pointer"}>
              {t("users.name")}
            </Th>
            <Th width="10%" textAlign={"center"} cursor={"pointer"}>
              {t("users.verified")}
            </Th>
            <Th width="10%" textAlign={"center"} cursor={"pointer"}>
              {t("users.status")}
            </Th>
            <Th width="10%" textAlign={"center"} cursor={"pointer"}>
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
                  {item.username}
                </Td>
                <Td
                  textAlign={"left"}
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                >
                  {item.email}
                </Td>
                <Td
                  textAlign={"left"}
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                >
                  {item.name}
                </Td>
                <Td>
                  <Flex justifyContent={"center"} alignItems={"center"}>
                    <Button
                      colorScheme={item.is_verified ? "green" : "red"}
                      w={10}
                      h={10}
                      borderRadius={"50%"}
                      overflow={"hidden"}
                      cursor={"auto"}
                    >
                      {item.is_verified ? <CheckIcon /> : <CloseIcon />}
                    </Button>
                  </Flex>
                </Td>
                <Td>
                  <Flex justifyContent={"center"} alignItems={"center"}>
                    <Button
                      colorScheme={item.is_locked ? "red" : "green"}
                      w={10}
                      h={10}
                      borderRadius={"50%"}
                      overflow={"hidden"}
                      cursor={"auto"}
                    >
                      {item.is_locked ? <CloseIcon /> : <CheckIcon />}
                    </Button>
                  </Flex>
                </Td>
                <Td>
                  <Flex justifyContent={"center"} alignItems={"center"}>
                    <Button
                      colorScheme="yellow"
                      onClick={() => {
                        setSelectedItem(item);
                        onOpen();
                      }}
                    >
                      {item.is_locked ? <UnlockIcon /> : <LockIcon />}
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
              <Button
                colorScheme="red"
                onClick={handleToggleAccountStatus}
                ml={3}
              >
                {t("common.confirm")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Fragment>
  );
}
