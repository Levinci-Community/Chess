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
import DatetimePicker from "../../../components/datetime/datetimePicker";
import axios from "../../../lib/axios";
import { toast_error, toast_success } from "../../../lib/hooks/toast";
import appSettings from "../../../settings/appSettings";

export default function AdminClubOfflinePage() {
  const toast = useToast();
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);

  const defaultData = useMemo(
    () => ({
      time: new Date(Date.now()).toISOString(),
      location: "",
    }),
    [],
  );
  const [formData, setFormData] = useState(defaultData);

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/offline-calendar`)
      .then((resp) => {
        setFormData(resp?.data?.offline_calendar ?? defaultData);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });
  }, [toast, t, defaultData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .put(`${appSettings.API_PROXY}/offline-calendar`, formData)
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
            {t("others.offline-calendar")}
          </Heading>
        </Flex>
        <form onSubmit={handleSubmit}>
          <FormControl id="time" mt={4} isRequired>
            <FormLabel>{t("others.time")}</FormLabel>
            <DatetimePicker
              value={formData.time}
              onChange={(hour, minute, date) => {
                try {
                  const selectedDate = new Date(date);
                  selectedDate.setHours(hour + 7);
                  selectedDate.setMinutes(minute);
                  setFormData({
                    ...formData,
                    time: selectedDate.toISOString(),
                  });
                } catch {}
              }}
            />
          </FormControl>
          <FormControl mt={4} id="location" isRequired>
            <FormLabel>{t("others.location")}</FormLabel>
            <Input
              type="text"
              name="location"
              value={formData.location}
              maxLength={100}
              placeholder={t("common.text_max_100")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: e?.target?.value,
                })
              }
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
