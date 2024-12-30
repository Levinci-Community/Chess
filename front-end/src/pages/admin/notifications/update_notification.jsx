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
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "../../../lib/axios";
import { useCurrentPath } from "../../../lib/hooks/route";
import { toast_error, toast_success } from "../../../lib/hooks/toast";
import appSettings from "../../../settings/appSettings";

export default function AdminUpdateNotificationPage() {
  const path = useCurrentPath();
  const id = path[path.length - 1];
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);

  const defaultData = useMemo(
    () => ({
      event: "",
      description: "",
    }),
    [],
  );
  const [formData, setFormData] = useState(defaultData);

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/notifications/${id}`)
      .then((resp) => {
        setFormData(resp?.data?.notification ?? defaultData);
      })
      .catch((err) => {
        if (err?.response) toast(toast_error(err?.response?.data?.message));
        else toast(toast_error(t("common.something_went_wrong")));
      });
  }, [toast, t, id, defaultData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .put(`${appSettings.API_PROXY}/notifications/${id}`, formData)
      .then(() => {
        navigate("/admin/notifications");
        toast(toast_success(t("common.update_success")));
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
            {t("notifications.update")}
          </Heading>
          <Button
            onClick={() => {
              navigate("/admin/notifications");
            }}
          >
            {"<"} {t("common.back")}
          </Button>
        </Flex>
        <form onSubmit={handleSubmit}>
          <FormControl id="title" isRequired mt={2} flex={3} mr={16}>
            <FormLabel>{t("notifications.title")}</FormLabel>
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
            <FormLabel>{t("notifications.description")}</FormLabel>
            <Input
              type="text"
              name="description"
              value={formData.description}
              maxLength={200}
              placeholder={t("common.text_max_200")}
              onChange={handleChange}
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
