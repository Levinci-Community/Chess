import React, { Fragment } from "react";
import { Navigate, Outlet, Route } from "react-router-dom";
import BlogPage from "../pages/club/blog";
import BlogListPage from "../pages/club/blogs";
import ChatPage from "../pages/friend/chat";
import FriendList from "../pages/friend/friends";
import AiGamePage from "../pages/game/aiGamePage";
import GameSettingsPage from "../pages/game/gameSettingsPage";
import LobbyPage from "../pages/game/lobby";
import OnlineGamePage from "../pages/game/online-game";
import WaitingFriendGamePage from "../pages/game/waitingFriendGame";
import WaitingGamePage from "../pages/game/waitingGame";
import HomePage from "../pages/home";
import BookPage from "../pages/practice/book";
import BookListPage from "../pages/practice/books";
import ChesslePage from "../pages/practice/chessle";
import NoirchessPage from "../pages/practice/noirchess";
import PuzzlePage from "../pages/practice/puzzle";
import VideoPage from "../pages/practice/video";
import VideoListPage from "../pages/practice/videos";
import TournamentPage from "../pages/tournament/tournament";
import TournamentGamePage from "../pages/tournament/tournamentGame";
import TournamentsPage from "../pages/tournament/tournaments";
import TvPage from "../pages/tv";
import UserProfile from "../pages/user/user_profile";

const ClientRoutes = ({ user }) => {
  return (
    <Fragment>
      <Route index element={<HomePage />} />
      <Route element={!!user ? <Outlet /> : <Navigate to="/login" />}>
        <Route path="blogs" element={<BlogListPage />} />
        <Route path="blog/:id" element={<BlogPage />} />
        <Route path="books" element={<BookListPage />} />
        <Route path="book/:id" element={<BookPage />} />
        <Route path="videos" element={<VideoListPage />} />
        <Route path="video/:id" element={<VideoPage />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="lobby" element={<LobbyPage user={user} />} />
        <Route path="wait/:id" element={<WaitingGamePage />} />
        <Route path="friendwait/:id" element={<WaitingFriendGamePage />} />
        <Route path="new-game" element={<GameSettingsPage user={user} />} />
        <Route path="online/:id" element={<OnlineGamePage />} />
        <Route path="ai-game/:id" element={<AiGamePage />} />
        <Route path="tournaments" element={<TournamentsPage />} />
        <Route path="tournament/:id" element={<TournamentPage />} />
        <Route path="tournament/game/:id" element={<TournamentGamePage />} />
        <Route path="tv" element={<TvPage />} />
        <Route path="friends" element={<FriendList />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="puzzle" element={<PuzzlePage />} />
        <Route path="chessle" element={<ChesslePage />} />
        <Route path="noirchess" element={<NoirchessPage />} />
      </Route>
    </Fragment>
  );
};

export default ClientRoutes;
