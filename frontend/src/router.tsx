import { createBrowserRouter } from "react-router-dom";

import { HomePage, Root } from "./pages";

export const router = createBrowserRouter([
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
