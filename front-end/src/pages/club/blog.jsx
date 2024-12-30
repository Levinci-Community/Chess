import {
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  Image,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";
import ReactHtmlParser from "html-react-parser";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DocNav from "../../components/nav/doc_nav";
import axios from "../../lib/axios";
import { formatDate } from "../../lib/datetime";
import { useCurrentPath } from "../../lib/hooks/route";
import { toast_error } from "../../lib/hooks/toast";
import appSettings from "../../settings/appSettings";

export default function BlogPage(props) {
  const path = useCurrentPath();
  const id = path[path.length - 1];
  const toast = useToast();
  const theme = localStorage.getItem("theme");
  const { t } = useTranslation();
  const [data, setData] = useState({});

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/blogs/${id}`)
      .then((resp) => {
        setData(resp?.data?.blog ?? {});
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });
  }, [toast, t, id]);

  return (
    <Fragment>
      <Container maxW="container.2xl" py={4}>
        <Flex>
          <Box w={"66%"}>
            <Flex align={"center"}>
              <Text fontSize={"2xl"} fontWeight={"bold"}>
                {t("blogs.blog")} {" > "}
              </Text>
              <Heading fontSize={"2xl"} textAlign={"justify"}>
                {data.title}
              </Heading>
            </Flex>
            <Flex>
              <Text>{data.description}</Text>
              <Spacer />
              <Text
                fontSize={"sm"}
                color={"gray"}
                w={"25%"}
                textAlign={"right"}
              >
                {t("common.created_at")} {formatDate(data.created_at)}
              </Text>
            </Flex>
            <Divider mb={4} borderColor={theme === "dark" ?? "black"} />
            <Image
              w={"100%"}
              maxH={240}
              src={`${appSettings.API_PROXY}/images/${data.image}`}
              alt={data.title}
              objectFit={"contain"}
              borderRadius={4}
            />
            <Box mt={4}>{ReactHtmlParser(data.content ?? "")}</Box>
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
