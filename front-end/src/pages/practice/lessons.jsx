import {
  Box,
  Container,
  Flex,
  Heading,
  Image,
  Link,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import appSettings from "../../settings/appSettings";

export default function LessonsPage() {
  const [lessonData, setLessonData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await axios.get(`${appSettings.API_PROXY}/lessons`);
      setLessonData(response.data); // Cập nhật dữ liệu từ server vào state
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  return (
    <Fragment>
      <Container maxW="container.2xl" py={4}>
        <Heading as="h1" mb={4}>
          Lessons
        </Heading>
        <List spacing={4}>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            lessonData.map((lesson) => (
              <ListItem key={lesson.id}>
                <Flex alignItems="center">
                  <Image
                    src={lesson.image}
                    alt={lesson.title}
                    w="198px"
                    h="108px"
                    objectFit="cover"
                  />
                  <Box flex="1" px={4}>
                    <Heading as="h2" size="md">
                      <Link as={RouterLink} to={lesson._id}>
                        {lesson.title}
                      </Link>
                    </Heading>
                    <Text>{lesson.description}</Text>
                  </Box>
                </Flex>
              </ListItem>
            ))
          )}
        </List>
      </Container>
    </Fragment>
  );
}
