import { createBrowserRouter } from "react-router-dom";
import EmployeeDashboard from "@/pages/EmployeeDashboard";
import SimulationEmployee from "@/pages/SimulationEmployee";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <EmployeeDashboard />,
  },
  {
    path: "/employee-dashboard",
    element: <EmployeeDashboard />,
  },
  {
    path: "/simulation-employee",
    element: <SimulationEmployee />,
  },
  {
    path: "*",
    element: <EmployeeDashboard />, // Fallback route
  }
]);

export default router; 