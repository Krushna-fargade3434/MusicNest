import { createRoot } from "react-dom/client";
import { registerSW } from 'virtual:pwa-register';
import App from "./App.tsx";
import "./index.css";

// Register Service Worker
if ("serviceWorker" in navigator) {
  registerSW({
    onNeedRefresh() {
      // Show a prompt to user to refresh
      if (confirm("New content available. Reload?")) {
        window.location.reload();
      }
    },
    onOfflineReady() {
      console.log("App is ready to work offline");
    },
    onRegisterError(error: any) {
      console.error("SW registration error", error);
    },
  });
}

createRoot(document.getElementById("root")!).render(<App />);
