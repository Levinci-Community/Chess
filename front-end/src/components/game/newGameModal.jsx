import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "../../lib/axios";
import { toast_error, toast_success } from "../../lib/hooks/toast";
import appSettings from "../../settings/appSettings";
import { CHESS, FRIEND, OFFLINE, ONLINE } from "../../settings/game";

const NewOnlineGameModal = ({
  isOpen,
  onClose,
  mode = ONLINE | FRIEND | OFFLINE,
  is_vip,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [variant, setVariant] = useState(undefined);
  const [initial_time, setInitialTime] = useState();
  const [bonus_time, setBonusTime] = useState();
  const [Ai_level, setAiLevel] = useState(1);

  const max_ai_level = is_vip ? 10 : 3;

  const onVariantChange = (e) => {
    setVariant(e.target.value);
  };

  const onInitialTimeChange = (e) => {
    setInitialTime(e.target.value);
  };

  const onBonusTimeChange = (e) => {
    setBonusTime(e.target.value);
  };

  const onAiLevelChange = (value) => {
    setAiLevel(value);
  };

  const validate = () => {
    if (!variant) {
      toast(toast_error(t("games.please_select_variant")));
      return false;
    }
    if (!initial_time) {
      toast(toast_error(t("games.please_enter_initial_time")));
      return false;
    }
    if (!bonus_time) {
      toast(toast_error(t("games.please_enter_bonus_time")));
      return false;
    }
    return true;
  };

  const newLobby = (data) => {
    setLoading(true);
    axios
      .post(`${appSettings.API_PROXY}/lobby`, data)
      .then((res) => {
        if (res.data) {
          toast(toast_success(t("games.lobby_created_successfully")));
          if (data.mode === ONLINE) navigate(`/wait/${res.data?._id}`);
          else if (data.mode === FRIEND)
            navigate(`/friendwait/${res.data?._id}`);
        } else {
          toast(toast_error(t("games.fail_to_create_lobby")));
        }
      })
      .catch((err) => {
        console.log(err?.response?.data);
        toast(toast_error(t("games.fail_to_create_lobby")));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const newOfflineGame = (data) => {
    setLoading(true);
    axios
      .post(`${appSettings.API_PROXY}/ai-game`, data)
      .then((res) => {
        if (res.data) {
          toast(toast_success(t("games.create_game_successfully")));
          navigate(`/ai-game/${res.data?._id}`);
        } else {
          toast(toast_error(t("games.fail_to_create_game")));
        }
      })
      .catch((err) => {
        console.log(err?.response?.data);
        toast(toast_error(t("games.fail_to_create_game")));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmit = () => {
    if (!validate()) {
      return false;
    }
    const data = {
      variant,
      initial_time: parseInt(initial_time),
      bonus_time: parseInt(bonus_time),
      mode,
    };
    if (mode === OFFLINE) {
      data.Ai_level = Ai_level;
      newOfflineGame(data);
    } else {
      newLobby(data);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t("games.play")}{" "}
          {mode === ONLINE
            ? t("games.online_game")
            : mode === FRIEND
              ? t("games.friend_game")
              : t("games.computer_game")}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>{t("games.variant")}</FormLabel>
            <Select
              variant="outline"
              placeholder={`-- ${t("games.variant")} --`}
              onChange={onVariantChange}
              value={variant}
            >
              <option value={CHESS}>{t("games.chess")}</option>
              {/* <option value={XIANGQI}>{t("games.xiangqi")}</option> */}
            </Select>
          </FormControl>
          <HStack mt={4}>
            <FormControl>
              <FormLabel htmlFor="initial-time">
                {t("games.initial_time")}
              </FormLabel>
              <Input
                id="initial-time"
                placeholder={t("games.minutes")}
                type="number"
                required
                onChange={onInitialTimeChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="bonus-time">
                {t("games.bonus_time")}
              </FormLabel>
              <Input
                id="bonus-time"
                placeholder={t("games.seconds")}
                type="number"
                required
                onChange={onBonusTimeChange}
              />
            </FormControl>
          </HStack>
          {mode === OFFLINE && (
            <FormControl mt={4}>
              <FormLabel>{t("games.ai_level")}</FormLabel>
              <Slider
                defaultValue={1}
                min={1}
                max={max_ai_level}
                value={Ai_level}
                onChange={onAiLevelChange}
              >
                {Array.from({ length: max_ai_level }).map((_, i) => (
                  <SliderMark key={i} value={i + 1} mt="1" fontSize="sm">
                    {i + 1}
                  </SliderMark>
                ))}
                <SliderTrack bgColor={"gray.100"}>
                  <SliderFilledTrack bg="black" />
                </SliderTrack>
                <SliderThumb bgColor={"black"} />
              </Slider>
            </FormControl>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="teal" onClick={onSubmit} isLoading={loading}>
            {t("common.submit")}
          </Button>
          <Button ml={2} onClick={onClose}>
            {t("common.cancel")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewOnlineGameModal;
