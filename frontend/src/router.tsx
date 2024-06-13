import { createBrowserRouter } from "react-router-dom";

import { HomePage, LoginPage, Root } from "./pages";

export const router = createBrowserRouter([
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "",
    element: <Root />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);
