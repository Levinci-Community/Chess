import { Container, useToast } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaBlog, FaBook, FaPlay, FaPuzzlePiece, FaVideo } from "react-icons/fa";
import axios from "../../lib/axios";
import { toast_error } from "../../lib/hooks/toast";
import appSettings from "../../settings/appSettings";
import NavList from "./nav_list";

export default function DocNav() {
  const { t } = useTranslation();
  const quick_play = useMemo(
    () => [
      { _id: "play-online", text: t("header.play"), href: "/new-game" },
      { _id: "lobby", text: t("header.lobby"), href: "/lobby" },
      {
        _id: "tournaments",
        text: t("header.tournaments"),
        href: "/tournaments",
      },
    ],
    [t],
  );

  const quick_pratice = useMemo(
    () => [
      { _id: "puzzles", text: t("header.puzzles"), href: "/puzzles" },
      { _id: "books", text: t("header.books"), href: "/books" },
      { _id: "videos", text: t("header.videos"), href: "videos" },
    ],
    [t],
  );

  const [books, setBooks] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [videos, setVideos] = useState([]);
  const toast = useToast();

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/blogs/top/3`)
      .then((resp) => {
        setBlogs(resp?.data?.blogs ?? []);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });

    axios
      .get(`${appSettings.API_PROXY}/books/top/3`)
      .then((resp) => {
        setBooks(resp?.data?.books ?? []);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });

    axios
      .get(`${appSettings.API_PROXY}/videos/top/3`)
      .then((resp) => {
        setVideos(resp?.data?.videos ?? []);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });
  }, [toast, t]);

  return (
    <Container mt={4}>
      <NavList
        list={blogs.map((blog) => {
          return {
            _id: blog._id,
            href: `/blog/${blog._id}`,
            text: blog.title,
          };
        })}
        heading={t("header.blogs")}
        icon={<FaBlog style={{ marginRight: "8px" }} />}
        my={4}
      />

      <NavList
        list={books.map((book) => {
          return {
            _id: book._id,
            href: `/book/${book._id}`,
            text: book.title,
          };
        })}
        heading={t("header.books")}
        icon={<FaBook style={{ marginRight: "8px" }} />}
        my={4}
      />

      <NavList
        list={videos.map((video) => {
          return {
            _id: video._id,
            href: `/video/${video._id}`,
            text: video.title,
          };
        })}
        heading={t("header.videos")}
        icon={<FaVideo style={{ marginRight: "8px" }} />}
        my={4}
      />

      <NavList
        list={quick_play ?? []}
        heading={t("header.play")}
        icon={<FaPlay style={{ marginRight: "8px" }} />}
        my={4}
      />

      <NavList
        list={quick_pratice ?? []}
        heading={t("header.practice")}
        icon={<FaPuzzlePiece style={{ marginRight: "8px" }} />}
      />
    </Container>
  );
}
