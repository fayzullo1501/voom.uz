import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Help from "../pages/Help";
import Article from "../pages/Article";

export const router = createBrowserRouter([
  {
    path: "/:lang",
    element: <Home />,
  },
  {
    path: "/:lang/help/:category",
    element: <Help />,
  },
  {
    path: "/:lang/help/:category/:slug",
    element: <Article />,
  },
]);