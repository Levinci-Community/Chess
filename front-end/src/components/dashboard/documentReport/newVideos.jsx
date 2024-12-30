import {
  Card,
  Heading,
  Link,
  ListItem,
  Spinner,
  UnorderedList,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaYoutube } from "react-icons/fa";

export default function NewVideos({ data }) {
  const { t } = useTranslation();
  return (
    <Card
      filter="auto"
      brightness="98%"
      p={1}
      variant={"outline"}
      overflow={"hidden"}
      borderRadius={4}
      mb={2}
      minH={120}
    >
      <Heading
        as={"h5"}
        fontSize={"sm"}
        display={"flex"}
        alignItems={"center"}
        mb={1}
      >
        <FaYoutube style={{ marginRight: 4 }} />
        {t("dashboard.new_videos")}
      </Heading>
      <UnorderedList>
        {!!data ? (
          data?.map((item, index) => (
            <ListItem key={`videos-${index}`}>
              <Link fontSize={"small"} noOfLines={1} href={`video/${item._id}`}>
                {item.title}
              </Link>
            </ListItem>
          ))
        ) : (
          <Spinner size={"sm"} />
        )}
      </UnorderedList>
    </Card>
  );
}
