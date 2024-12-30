import {
  AddIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
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
  List,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
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

export default function AdminPage() {
  const theme = localStorage.getItem("theme");
  const toast = useToast();
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [users, setUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);
  const [data, setData] = useState([]);
  const [renderData, setRenderData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const pageSize = 10;

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/users/admins`)
      .then((resp) => {
        setData(resp?.data?.users ?? []);
        setRenderData(resp?.data?.users ?? []);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });

    axios
      .get(`${appSettings.API_PROXY}/users`)
      .then((resp) => {
        setUsers(resp?.data?.users ?? []);
        setSearchUsers(resp?.data?.users ?? []);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });
  }, [toast, t]);

  const handleItemClick = (selected) => {
    axios
      .put(`${appSettings.API_PROXY}/users/${selected.id}/role`, {
        role: "ADMIN",
      })
      .then((resp) => {
        setData([...data, { ...selected, role: "ADMIN" }]);
        setRenderData([...renderData, { ...selected, role: "ADMIN" }]);
        toast(toast_success(t("common.success")));
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      })
      .finally(() => {
        onClose();
      });
  };

  const handleToggleAccountStatus = () => {
    if (!selectedItem) {
      toast(toast_error(t("common.not_found")));
    }
    axios
      .put(`${appSettings.API_PROXY}/users/${selectedItem.id}/role`, {
        role: "PLAYER",
      })
      .then((resp) => {
        setRenderData(renderData.filter((item) => item.id !== selectedItem.id));
        setData(data.filter((item) => item.id !== selectedItem.id));
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
            {t("users.admin_management")}
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
                    data.filter((value) =>
                      value?.title
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
            <Popover>
              <PopoverTrigger>
                <Button colorScheme="green" w={32}>
                  <AddIcon mr={2} /> {t("users.new_admin")}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>
                  <Input
                    variant={"ghost"}
                    placeholder={t("users.enter_email")}
                    fontSize={"sm"}
                    p={0}
                    onChange={(e) => {
                      const text = e?.target?.value ?? "";
                      setSearchUsers(
                        users.filter((value) =>
                          value.email
                            .toLowerCase()
                            .includes(text.toLowerCase()),
                        ),
                      );
                    }}
                  />
                </PopoverHeader>
                <PopoverBody maxH={400}>
                  <List spacing={2}>
                    {searchUsers.map((item) => (
                      <ListItem
                        key={item.id}
                        cursor={"pointer"}
                        onClick={() => handleItemClick(item)}
                        _hover={{ bgColor: "gray.100" }}
                      >
                        {item.email}
                      </ListItem>
                    ))}
                  </List>
                </PopoverBody>
              </PopoverContent>
            </Popover>
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
