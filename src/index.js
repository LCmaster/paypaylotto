import React from "react";

import App from "./App";
import "./index.css";

import { createRoot } from "react-dom/client";

import { AppProvider } from "./context/AppContext";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <AppProvider>
    <App tab="home" />
  </AppProvider>
);
