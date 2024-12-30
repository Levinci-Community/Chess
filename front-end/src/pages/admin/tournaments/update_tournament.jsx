import {
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DateTimePicker from "../../../components/datetime/datetimePicker";
import axios from "../../../lib/axios";
import { useCurrentPath } from "../../../lib/hooks/route";
import { toast_error, toast_success } from "../../../lib/hooks/toast";
import appSettings from "../../../settings/appSettings";
import { CHESS } from "../../../settings/game";

export default function AdminUpdatetournamentPage() {
  const path = useCurrentPath();
  const id = path[path.length - 1];
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);

  const defaultData = useMemo(
    () => ({
      name: "",
      description: "",
      variant: CHESS,
      initial_time: 0,
      bonus_time: 0,
      start: Date.now(),
      end: Date.now(),
    }),
    [],
  );

  const [formData, setFormData] = useState(defaultData);

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/tournaments/${id}`)
      .then((resp) => {
        setFormData(resp?.data?.tournament ?? defaultData);
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
      .put(`${appSettings.API_PROXY}/tournaments/${id}`, formData)
      .then(() => {
        navigate("/admin/tournaments");
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
            {t("tournaments.update")}
          </Heading>
          <Button
            onClick={() => {
              navigate("/admin/tournaments");
            }}
          >
            {"<"} {t("common.back")}
          </Button>
        </Flex>
        <form onSubmit={handleSubmit}>
          <FormControl id="name" isRequired>
            <FormLabel>{t("tournaments.name")}</FormLabel>
            <Input
              type="text"
              name="name"
              value={formData.name}
              maxLength={100}
              placeholder={t("common.text_max_100")}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="description" mt={4} isRequired>
            <FormLabel>{t("tournaments.description")}</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              maxLength={500}
              placeholder={t("common.text_max_500")}
              onChange={handleChange}
            />
          </FormControl>
          <Flex justify={"space-between"}>
            <FormControl id="variant" mt={4} isRequired>
              <FormLabel>{t("common.variant")}</FormLabel>
              <Select
                value={formData.variant}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    variant: e?.target?.value,
                  });
                }}
                w={{ base: 200, md: 200 }}
              >
                <option value={CHESS}>{t("common.chess")}</option>
                {/* <option value={XIANGQI}>{t("common.xiangqi")}</option> */}
              </Select>
            </FormControl>
            <FormControl />
            <FormControl id="initial_time" mt={4} isRequired>
              <FormLabel>{t("common.initial_time")}</FormLabel>
              <Flex alignItems={"center"}>
                <Input
                  type="number"
                  name="initial_time"
                  value={formData.initial_time}
                  onChange={handleChange}
                  w={100}
                  mr={4}
                />
                <Text>{t("common.minute")}</Text>
              </Flex>
            </FormControl>
            <FormControl id="bonus_time" mt={4} isRequired>
              <FormLabel>{t("common.bonus_time")}</FormLabel>
              <Flex alignItems={"center"}>
                <Input
                  type="number"
                  name="bonus_time"
                  value={formData.bonus_time}
                  onChange={handleChange}
                  w={100}
                  mr={4}
                />
                <Text>{t("common.second")}</Text>
              </Flex>
            </FormControl>
          </Flex>
          <Flex justify={"space-between"}>
            <FormControl id="start" mt={4} isRequired>
              <FormLabel>{t("common.start")}</FormLabel>
              <DateTimePicker
                value={formData.start}
                onChange={(hour, minute, date) => {
                  const selectedDate = new Date(date);
                  selectedDate.setHours(hour);
                  selectedDate.setMinutes(minute);
                  setFormData({
                    ...formData,
                    start: selectedDate,
                  });
                }}
              />
            </FormControl>
            <FormControl id="end" mt={4} isRequired>
              <FormLabel>{t("common.end")}</FormLabel>
              <DateTimePicker
                value={formData.end}
                onChange={(hour, minute, date) => {
                  const selectedDate = new Date(date);
                  selectedDate.setHours(hour);
                  selectedDate.setMinutes(minute);
                  setFormData({
                    ...formData,
                    end: selectedDate,
                  });
                }}
              />
            </FormControl>
          </Flex>
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
