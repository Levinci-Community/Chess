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
  useToast,
} from "@chakra-ui/react";
import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "../../../lib/axios";
import { toast_error, toast_success } from "../../../lib/hooks/toast";
import appSettings from "../../../settings/appSettings";

export default function AdminDonatePage() {
  const toast = useToast();
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);

  const defaultData = {
    image: "donate",
  };
  const [formData, setFormData] = useState(defaultData);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .put(`${appSettings.API_PROXY}/donate`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
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
            {t("others.donate")}
          </Heading>
        </Flex>
        <form onSubmit={handleSubmit}>
          <FormControl id="image" mt={4}>
            <FormLabel>{t("others.image")}</FormLabel>
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
