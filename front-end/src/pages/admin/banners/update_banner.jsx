import {
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "../../../lib/axios";
import { useCurrentPath } from "../../../lib/hooks/route";
import { toast_error, toast_success } from "../../../lib/hooks/toast";
import appSettings from "../../../settings/appSettings";

export default function AdminUpdateBannerPage() {
  const path = useCurrentPath();
  const id = path[path.length - 1];
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);

  const defaultData = useMemo(
    () => ({
      title: "",
      description: "",
      image: null,
    }),
    []
  );
  const [formData, setFormData] = useState(defaultData);

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/banners/${id}`)
      .then((resp) => {
        setFormData(resp?.data?.banner ?? defaultData);
      })
      .catch((err) => {
        if (err?.response) toast(toast_error(err?.response?.data?.message));
        else toast(toast_error(t("common.something_went_wrong")));
      });
  }, [defaultData, id, t, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .put(`${appSettings.API_PROXY}/banners/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        navigate("/admin/banners");
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
            {t("banners.update")}
          </Heading>
          <Button
            onClick={() => {
              navigate("/admin/banners");
            }}
          >
            {"<"} {t("common.back")}
          </Button>
        </Flex>
        <form onSubmit={handleSubmit}>
          <FormControl id="title" isRequired>
            <FormLabel>{t("banners.title")}</FormLabel>
            <Input
              type="text"
              name="title"
              value={formData.title}
              maxLength={100}
              placeholder={t("common.text_max_100")}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="description" mt={4} isRequired>
            <FormLabel>{t("banners.description")}</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              maxLength={500}
              placeholder={t("common.text_max_500")}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="image" mt={4}>
            <FormLabel>{t("banners.image")}</FormLabel>
            <Input
              type="file"
              accept=".png, .jpg, .jpeg"
              name="image"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files[0] })
              }
              p={1}
            />
            {typeof formData?.image === "string" ? (
              formData.image.length > 0 && (
                <Image
                  h={100}
                  src={`${appSettings.API_PROXY}/images/${formData.image}`}
                  alt={formData.title}
                />
              )
            ) : (
              <Image
                h={100}
                w={100}
                src={
                  formData.image instanceof File &&
                  URL.createObjectURL(formData.image)
                }
                alt={formData.title}
              />
            )}
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
