import {
  Card,
  Heading,
  Link,
  ListItem,
  Spinner,
  UnorderedList,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaMedal } from "react-icons/fa";

export default function NewAchievements({ data }) {
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
        <FaMedal style={{ marginRight: 4 }} />
        {t("dashboard.new_achievements")}
      </Heading>
      <UnorderedList>
        {!!data ? (
          data?.map((item, index) => (
            <ListItem key={`achievements-${index}`}>
              <Link
                fontSize={"small"}
                noOfLines={1}
                href={`achievement/${item._id}`}
              >
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
