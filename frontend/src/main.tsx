import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./AuthPage.tsx";
import "../styles/global.css";
import RootApp from "./RootApp.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>
);
