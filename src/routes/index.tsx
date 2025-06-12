import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import Register from "@/pages/Register";
import Demo from "@/pages/Demo";
import Contact from "@/pages/Contact";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/demo",
    element: <Demo />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
]); 