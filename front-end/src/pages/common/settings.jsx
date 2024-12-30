import {
  Container,
  Flex,
  HStack,
  Heading,
  Select,
  Spacer,
  useColorMode,
} from "@chakra-ui/react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

const SettingsPage = () => {
  const savedLang = localStorage.getItem("lang");
  const savedTheme = localStorage.getItem("theme");

  const [language, setLanguage] = useState(savedLang ?? "en");
  const [theme, setTheme] = useState(savedTheme ?? "light");
  const { toggleColorMode } = useColorMode();

  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang);
  };

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    toggleColorMode();
    setTheme(selectedTheme);
    localStorage.setItem("theme", selectedTheme);
    window.location.reload();
  };

  return (
    <Fragment>
      <Container maxW="6xl" mt={8}>
        <Heading mb={16}>{t("settings.heading")}</Heading>
        <Flex
          w={"100%"}
          justifyContent={"space-between"}
          display={{ base: "block", md: "flex" }}
        >
          <HStack w={"50%"} py={4}>
            <Heading size="md" mb={2}>
              {t("settings.languageSettings")}
            </Heading>
            <Spacer />
            <Select
              value={language}
              onChange={handleLanguageChange}
              w={{ base: 200, md: 300 }}
            >
              <option value="en">{t("settings.english")}</option>
              <option value="vi">{t("settings.vietnamese")}</option>
            </Select>
          </HStack>
        </Flex>
        <Flex
          w={"100%"}
          justifyContent={"space-between"}
          display={{ base: "block", md: "flex" }}
        >
          <HStack w={"50%"} py={4}>
            <Heading size="md" mb={2}>
              {t("settings.themeSettings")}
            </Heading>
            <Spacer />
            <Select
              value={theme}
              onChange={handleThemeChange}
              w={{ base: 200, md: 300 }}
            >
              <option value="light">{t("settings.light")}</option>
              <option value="dark">{t("settings.dark")}</option>
            </Select>
          </HStack>
        </Flex>
      </Container>
    </Fragment>
  );
};

export default SettingsPage;
