import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import PredictionPage from "./pages/PredictionPage";
import MapPage from "./pages/MapPage";
import AboutPage from "./pages/AboutPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "dashboard", Component: Dashboard },
      { path: "prediction", Component: PredictionPage },
      { path: "map", Component: MapPage },
      { path: "about", Component: AboutPage },
    ],
  },
]);
