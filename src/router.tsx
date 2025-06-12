import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Simulation from "./pages/Simulation";
import SimulationEmployee from "./pages/SimulationEmployee";
import SimulationEnterprise from "./pages/SimulationEnterprise";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Resources from "./pages/Resources";
import CountrySelection from "./pages/CountrySelection";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EnterpriseDashboard from "./pages/EnterpriseDashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/simulation",
    element: <Simulation />,
  },
  {
    path: "/simulation-employee",
    element: <SimulationEmployee />,
  },
  {
    path: "/simulation-enterprise",
    element: <SimulationEnterprise />,
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
    path: "/resources",
    element: <Resources />,
  },
  {
    path: "/country-selection",
    element: <CountrySelection />,
  },
  {
    path: "/employee-dashboard",
    element: <EmployeeDashboard />,
  },
  {
    path: "/enterprise-dashboard",
    element: <EnterpriseDashboard />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router; 