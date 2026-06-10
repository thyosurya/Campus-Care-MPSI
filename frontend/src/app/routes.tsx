import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { StudentDashboard } from "./pages/StudentDashboard";
import { TechnicianDashboard } from "./pages/TechnicianDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ReportForm } from "./pages/ReportForm";
import { ReportDetail } from "./pages/ReportDetail";
import { ReportList } from "./pages/ReportList";
import { GenericPage } from "./pages/GenericPage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { NotificationPage } from "./pages/NotificationPage";
import { FacilitiesPage } from "./pages/FacilitiesPage";
import { TechniciansPage } from "./pages/TechniciansPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { SettingsPage } from "./pages/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      // Grouping pages that use the same Layout
      {
        path: "student",
        children: [
          { index: true, Component: StudentDashboard },
          { path: "reports", Component: ReportList },
          { path: "report/new", Component: ReportForm },
          { path: "report/:id", Component: ReportDetail },
          { path: "notifications", Component: NotificationPage },
          { path: "profile", Component: ProfilePage },
        ]
      },
      {
        path: "technician",
        children: [
          { index: true, Component: TechnicianDashboard },
          { path: "reports", Component: ReportList },
          { path: "report/:id", Component: ReportDetail },
          { path: "notifications", Component: NotificationPage },
          { path: "profile", Component: ProfilePage },
        ]
      },
      {
        path: "admin",
        children: [
          { index: true, Component: AdminDashboard },
          { path: "reports", Component: ReportList },
          { path: "report/:id", Component: ReportDetail },
          { path: "facilities", Component: FacilitiesPage },
          { path: "technicians", Component: TechniciansPage },
          { path: "analytics", Component: AnalyticsPage },
          { path: "notifications", Component: NotificationPage },
          { path: "profile", Component: ProfilePage },
          { path: "settings", Component: SettingsPage },
        ]
      },
      // Fallback for root level access if needed, though we prefer role-prefixed
      { path: "reports", element: <Navigate to="student/reports" replace /> },
      { path: "notifications", element: <Navigate to="student/notifications" replace /> },
      { path: "profile", element: <Navigate to="student/profile" replace /> },
    ],
  },
]);
