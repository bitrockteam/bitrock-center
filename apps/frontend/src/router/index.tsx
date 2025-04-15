import { AuthenticatedPage } from "@/context/AuthenticatedPage";
import { lazy } from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";

const Dashboard = lazy(() => import("../pages/dashboard"));
const Login = lazy(() => import("../pages/login"));
const Register = lazy(() => import("../pages/register"));
const NotFound = lazy(() => import("../pages/not-found"));
const ErrorPage = lazy(() => import("../pages/error"));
const FeriePermessi = lazy(() => import("../pages/ferie-permessi"));
const Consuntivazione = lazy(() => import("../pages/consuntivazione"));
const Users = lazy(() => import("../pages/users"));
const UserDetail = lazy(() => import("../components/users/user-detail"));
const Projects = lazy(() => import("../pages/projects"));
const ProjectDetail = lazy(
  () => import("../components/projects/project-detail"),
);

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <AuthenticatedPage>
        <Dashboard />
      </AuthenticatedPage>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <AuthenticatedPage>
        <Dashboard />
      </AuthenticatedPage>
    ),
  },
  {
    path: "/ferie-permessi",
    element: (
      <AuthenticatedPage>
        <FeriePermessi />
      </AuthenticatedPage>
    ),
  },
  {
    path: "/consuntivazione",
    element: (
      <AuthenticatedPage>
        <Consuntivazione />
      </AuthenticatedPage>
    ),
  },
  {
    path: "/utenti",
    element: (
      <AuthenticatedPage>
        <Users />
      </AuthenticatedPage>
    ),
  },
  {
    path: "/utenti/:id",
    element: (
      <AuthenticatedPage>
        <UserDetail />
      </AuthenticatedPage>
    ),
  },
  {
    path: "/progetti",
    element: (
      <AuthenticatedPage>
        <Projects />
      </AuthenticatedPage>
    ),
  },
  {
    path: "/progetti/:id",
    element: (
      <AuthenticatedPage>
        <ProjectDetail />
      </AuthenticatedPage>
    ),
  },
  {
    path: "/error",
    element: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export const router = createBrowserRouter(routes);
