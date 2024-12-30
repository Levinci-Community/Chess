import {
  HStack,
  Stack,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export default function Stats(props) {
  const { label, oldValue, newValue } = props;
  const { t } = useTranslation();

  return (
    <StatGroup>
      <Stat>
        <HStack>
          <StatLabel>{label}</StatLabel>
          <StatHelpText m={0}>
            <StatArrow
              type={
                newValue === oldValue
                  ? ""
                  : newValue > oldValue
                    ? "increase"
                    : "decrease"
              }
            />
            {Math.abs(newValue - oldValue)}
          </StatHelpText>
        </HStack>
        <HStack>
          <Stack w="50%">
            <Text color="gray.500" fontSize="sm">
              {t("profile.last_month")}:
            </Text>
            <StatNumber textAlign="center">{oldValue}</StatNumber>
          </Stack>
          <Stack w="50%">
            <Text color="gray.500" fontSize="sm">
              {t("profile.current_month")}:
            </Text>
            <StatNumber textAlign="center">{newValue}</StatNumber>
          </Stack>
        </HStack>
      </Stat>
    </StatGroup>
  );
}
