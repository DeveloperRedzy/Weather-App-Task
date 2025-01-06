import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { DashboardLayout } from "./layout/DashboardLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const LocationOverview = lazy(() => import("./pages/LocationOverview"));

const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    errorElement: (
      <ErrorBoundary>
        <DashboardLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/dashboard",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "/location",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/location/:locationId",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <LocationOverview />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
