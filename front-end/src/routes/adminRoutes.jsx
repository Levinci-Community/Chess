import React from "react";
import { Navigate, Route } from "react-router-dom";
import AdminDashboardPage from "../pages/admin";
import AdminAchievementsPage from "../pages/admin/achievements";
import AdminCreateAchievementPage from "../pages/admin/achievements/create_achievement";
import AdminUpdateAchievementPage from "../pages/admin/achievements/update_achievement";
import AdminBannersPage from "../pages/admin/banners";
import AdminCreateBannerPage from "../pages/admin/banners/create_banner";
import AdminUpdateBannerPage from "../pages/admin/banners/update_banner";
import AdminBlogsPage from "../pages/admin/blogs";
import AdminCreateBlogsPage from "../pages/admin/blogs/create_blog";
import AdminUpdateBlogPage from "../pages/admin/blogs/update_blog";
import AdminBooksPage from "../pages/admin/books";
import AdminCreateBookPage from "../pages/admin/books/create_book";
import AdminUpdateBookPage from "../pages/admin/books/update_book";
import AdminClubOfflinePage from "../pages/admin/club-offline";
import AdminDonatePage from "../pages/admin/donate";
import AdminGamesPage from "../pages/admin/games";
import AdminNotificationsPage from "../pages/admin/notifications";
import AdminCreateNotificationPage from "../pages/admin/notifications/create_notification";
import AdminUpdateNotificationPage from "../pages/admin/notifications/update_notification";
import AdminPuzzlesPage from "../pages/admin/puzzles";
import AdminTournamentsPage from "../pages/admin/tournaments";
import AdminCreateTournamentPage from "../pages/admin/tournaments/create_tournament";
import AdminUpdateTournamentPage from "../pages/admin/tournaments/update_tournament";
import AdminUsersPage from "../pages/admin/users";
import AdminPage from "../pages/admin/users/admin";
import AdminVideosPage from "../pages/admin/videos";
import AdminCreateVideoPage from "../pages/admin/videos/create_video";
import AdminUpdateVideoPage from "../pages/admin/videos/update_video";

const AdminRoutes = ({ user }) => {
  return (
    <Route
      element={user?.role === "ADMIN" ? null : <Navigate to={"/not-found"} />}
    >
      <Route index element={<AdminDashboardPage />} />

      <Route path="blogs" element={<AdminBlogsPage />} />
      <Route path="create-blog" element={<AdminCreateBlogsPage />} />
      <Route path="update-blog/:id" element={<AdminUpdateBlogPage />} />

      <Route path="books" element={<AdminBooksPage />} />
      <Route path="create-book" element={<AdminCreateBookPage />} />
      <Route path="update-book/:id" element={<AdminUpdateBookPage />} />

      <Route path="tournaments" element={<AdminTournamentsPage />} />
      <Route path="create-tournament" element={<AdminCreateTournamentPage />} />
      <Route
        path="update-tournament/:id"
        element={<AdminUpdateTournamentPage />}
      />

      <Route path="achievements" element={<AdminAchievementsPage />} />
      <Route
        path="create-achievement"
        element={<AdminCreateAchievementPage />}
      />
      <Route
        path="update-achievement/:id"
        element={<AdminUpdateAchievementPage />}
      />
      <Route path="notifications" element={<AdminNotificationsPage />} />
      <Route
        path="create-notification"
        element={<AdminCreateNotificationPage />}
      />
      <Route
        path="update-notification/:id"
        element={<AdminUpdateNotificationPage />}
      />
      <Route path="puzzles" element={<AdminPuzzlesPage />} />
      <Route path="games" element={<AdminGamesPage />} />

      <Route path="users" element={<AdminUsersPage />} />
      <Route path="admins" element={<AdminPage />} />

      <Route path="videos" element={<AdminVideosPage />} />
      <Route path="create-video" element={<AdminCreateVideoPage />} />
      <Route path="update-video/:id" element={<AdminUpdateVideoPage />} />
      <Route path="donate" element={<AdminDonatePage />} />
      <Route path="club-offline" element={<AdminClubOfflinePage />} />

      <Route path="banners" element={<AdminBannersPage />} />
      <Route path="create-banner" element={<AdminCreateBannerPage />} />
      <Route path="update-banner/:id" element={<AdminUpdateBannerPage />} />

      <Route path="*" element={<Navigate to={"/admin"} />} />
    </Route>
  );
};

export default AdminRoutes;
