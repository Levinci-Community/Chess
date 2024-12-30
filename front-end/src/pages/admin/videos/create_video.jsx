import {
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import EditorContent from "../../../components/item_list/editor_content";
import axios from "../../../lib/axios";
import { toast_error, toast_success } from "../../../lib/hooks/toast";
import appSettings from "../../../settings/appSettings";

export default function AdminCreateVideoPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);

  const defaultData = {
    title: "",
    description: "",
    link: "",
    content: "",
  };
  const [formData, setFormData] = useState(defaultData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    axios
      .post(`${appSettings.API_PROXY}/videos`, formData)
      .then(() => {
        navigate("/admin/videos");
        toast(toast_success(t("common.create_success")));
      })
      .catch((err) => {
        if (err?.response) toast(toast_error(err?.response?.data?.message));
        else toast(toast_error(t("common.something_went_wrong")));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Fragment>
      <Container maxW="container.2xl" py={4}>
        <Flex justify={"space-between"}>
          <Heading fontSize={"xl"} mb={4}>
            {t("videos.create")}
          </Heading>
          <Button
            onClick={() => {
              navigate("/admin/videos");
            }}
          >
            {"<"} {t("common.back")}
          </Button>
        </Flex>
        <form onSubmit={handleSubmit}>
          <FormControl id="title" isRequired mt={2} flex={3} mr={16}>
            <FormLabel>{t("videos.title")}</FormLabel>
            <Input
              type="text"
              name="title"
              value={formData.title}
              maxLength={100}
              placeholder={t("common.text_max_100")}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="description" isRequired mt={2}>
            <FormLabel>{t("videos.description")}</FormLabel>
            <Input
              type="text"
              name="description"
              value={formData.description}
              maxLength={200}
              placeholder={t("common.text_max_200")}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="link" mt={4} isRequired>
            <FormLabel>{t("videos.video")}</FormLabel>
            <Input
              type="text"
              name="link"
              value={formData.link}
              placeholder={t("common.text_max_100")}
              onChange={handleChange}
              mb={4}
            />
            {formData.link && <ReactPlayer url={formData.link} controls />}
          </FormControl>
          <FormControl id="content" mt={4} isRequired>
            <FormLabel>{t("videos.content")}</FormLabel>
            <EditorContent
              content={formData.content}
              onChange={(value) => {
                setFormData({ ...formData, content: value });
              }}
            />
          </FormControl>

          <Center>
            <Button
              type="submit"
              colorScheme="teal"
              mt={4}
              isLoading={isLoading}
              minW={200}
            >
              {t("common.submit")}
            </Button>
          </Center>
        </form>
      </Container>
    </Fragment>
  );
}
