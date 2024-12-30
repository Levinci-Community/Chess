import {
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";
import ReactHtmlParser from "html-react-parser";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactPlayer from "react-player";
import DocNav from "../../components/nav/doc_nav";
import axios from "../../lib/axios";
import { formatDate } from "../../lib/datetime";
import { useCurrentPath } from "../../lib/hooks/route";
import { toast_error } from "../../lib/hooks/toast";
import appSettings from "../../settings/appSettings";

export default function VideoPage(props) {
  const path = useCurrentPath();
  const id = path[path.length - 1];
  const toast = useToast();
  const theme = localStorage.getItem("theme");
  const { t } = useTranslation();
  const [data, setData] = useState({});

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/videos/${id}`)
      .then((resp) => {
        setData(resp?.data?.video ?? {});
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
                {t("videos.video")} {" > "}
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
            <ReactPlayer url={data.link} controls />
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
