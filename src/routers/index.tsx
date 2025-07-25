import { createBrowserRouter } from "react-router-dom";
import { map } from "./map";
import Template from "../templates";
import { lazy } from "react";

const Home = lazy(() => import('../components/Home'));

export const routers = createBrowserRouter([
  {
    path: "/",
    element: <Template />,
    children: [
      {
        index: true,
        path: map.home,
        element: <Home />,
      },
    ],
  },
]);