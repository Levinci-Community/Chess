import {
  Box,
  Container,
  Flex,
  Heading,
  Image,
  ListItem,
  OrderedList,
  Text,
} from "@chakra-ui/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import Image1 from "../../assets/images/about/1.jpg";
import Image2 from "../../assets/images/about/2.webp";

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <Container maxW="container.xl" py={4}>
        <Flex mb={8} alignItems={"center"}>
          <Image
            src={"./logo.png"}
            alt={t("about.aboutUs.heading")}
            mb={4}
            w={200}
          />
          <Box ml={8}>
            <Heading as="h1" mb={4}>
              {t("about.aboutUs.heading")}
            </Heading>
            <Text mb={6} w={"85%"} textAlign={"justify"}>
              {t("about.aboutUs.content")}
            </Text>
          </Box>
        </Flex>

        <Flex mb={8} alignItems={"center"}>
          <Box mr={8}>
            <Heading as="h3" size="lg" mb={2}>
              {t("about.ourMission.heading")}
            </Heading>
            <OrderedList>
              <ListItem mb={2}>
                <Text fontWeight="bold">
                  {t("about.ourMission.list.promoteChess")}:
                </Text>{" "}
                <Text w={"85%"} textAlign={"justify"}>
                  {t("about.ourMission.content.promoteChess")}
                </Text>
              </ListItem>
              <ListItem mb={2}>
                <Text fontWeight="bold">
                  {t("about.ourMission.list.developSkills")}:
                </Text>{" "}
                <Text w={"85%"} textAlign={"justify"}>
                  {t("about.ourMission.content.developSkills")}
                </Text>
              </ListItem>
              <ListItem mb={2}>
                <Text fontWeight="bold">
                  {t("about.ourMission.list.buildCommunity")}:
                </Text>{" "}
                <Text w={"85%"} textAlign={"justify"}>
                  {t("about.ourMission.content.buildCommunity")}
                </Text>
              </ListItem>
              <ListItem mb={2}>
                <Text fontWeight="bold">
                  {t("about.ourMission.list.encourageSportsmanship")}:
                </Text>{" "}
                <Text w={"85%"} textAlign={"justify"}>
                  {t("about.ourMission.content.encourageSportsmanship")}
                </Text>
              </ListItem>
            </OrderedList>
          </Box>
          <Image src={Image1} alt="About Us" mb={4} w={400} />
        </Flex>

        <Flex mb={8} alignItems={"center"}>
          <Image src={Image2} alt="About Us" mb={4} w={400} />
          <Box ml={16}>
            <Heading as="h3" size="lg" mb={2}>
              {t("about.whatWeOffer.heading")}
            </Heading>
            <Text mb={4} textAlign={"justify"}>
              {t("about.whatWeOffer.content")}
            </Text>
          </Box>
        </Flex>
      </Container>
    </Fragment>
  );
};

export default AboutPage;
