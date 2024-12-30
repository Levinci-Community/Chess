import { Card, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export default function ToturialBox({ name }) {
  const { t } = useTranslation();
  const raw_steps = t(`${name}.steps`, { returnObjects: true });
  const steps = typeof raw_steps === typeof [] ? raw_steps : [];

  return (
    <Card border={1} p={2} filter={"auto"} brightness={"90%"}>
      <Heading fontSize={"lg"}>{t(`${name}.title`)}</Heading>
      <Text textAlign={"justify"} my={2}>
        {t(`${name}.description`)}
      </Text>
      {steps.map((_, index) => (
        <Flex key={index}>
          <Text textAlign={"justify"} mt={2}>
            <strong>
              {`${index + 1}. ${t(`${name}.steps.${index}.title`)}: `}
            </strong>
            {t(`${name}.steps.${index}.description`)}
          </Text>
        </Flex>
      ))}
    </Card>
  );
}
