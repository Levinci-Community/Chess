import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Container,
  Flex,
  Heading,
  Image,
  Input,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DocNav from "../../components/nav/doc_nav";
import axios from "../../lib/axios";
import { toast_error } from "../../lib/hooks/toast";
import appSettings from "../../settings/appSettings";

export default function BookListPage(props) {
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [renderData, setRenderData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = React.useState(1);
  const pageSize = 5;

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/books`)
      .then((resp) => {
        setData(resp?.data?.books ?? []);
        setRenderData(resp?.data?.books ?? []);
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
            {t("books.books")}
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
                colorScheme="gray"
                onClick={() => {
                  setRenderData(
                    data.filter(
                      (value) =>
                        value?.title
                          ?.toLowerCase()
                          .includes(searchText.toLowerCase()) ||
                        value?.description
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
        <Flex>
          <Box w={"66%"} mt={8}>
            {renderData
              .slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
              .map((item, index) => (
                <Card
                  key={index}
                  p={4}
                  variant={"outline"}
                  onClick={() => {
                    navigate(`/book/${item._id}`);
                  }}
                  cursor={"pointer"}
                  mb={4}
                >
                  <Flex
                    justifyContent={"start"}
                    alignItems={"center"}
                    w={"100%"}
                  >
                    <Image
                      h={20}
                      w={20}
                      src={`${appSettings.API_PROXY}/images/${item.image}`}
                      alt={item.title}
                      objectFit={"cover"}
                      borderRadius={4}
                    />
                    <Box ml={4}>
                      <Text fontWeight={"bold"} noOfLines={1}>
                        {item.title}
                      </Text>
                      <Text noOfLines={2}>{item.description}</Text>
                    </Box>
                  </Flex>
                </Card>
              ))}
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
          </Box>
          <Spacer />
          <Box w={"30%"}>
            <DocNav />
          </Box>
        </Flex>
      </Container>
    </Fragment>
  );
}
