import { Box, Container, Heading, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import appSettings from "../../settings/appSettings";

export default function LessonDetailPage() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLesson();
  }, []);

  const fetchLesson = async () => {
    try {
      const response = await axios.get(
        `${appSettings.API_PROXY}/lessons/${lessonId}`,
      );
      setLesson(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lesson:", error);
    }
  };

  if (loading) {
    return (
      <Fragment>
        <Container maxW="container.2xl" py={4}>
          <Heading as="h1" mb={4}>
            Loading...
          </Heading>
        </Container>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Container maxW="container.2xl" py={4}>
        <Box>
          <Image
            src={lesson.image}
            alt={lesson.title}
            w="50%"
            h="auto"
            objectFit="cover"
          />
          <Heading as="h1" mb={4}>
            {lesson.title}
          </Heading>
          <Text>{lesson.description}</Text>
          <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </Box>
      </Container>
    </Fragment>
  );
}
