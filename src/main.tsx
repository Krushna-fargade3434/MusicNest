import { createRoot } from "react-dom/client";
import { registerSW } from 'virtual:pwa-register';
import App from "./App.tsx";
import "./index.css";

// Register Service Worker with enhanced offline support
if ("serviceWorker" in navigator) {
  try {
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        // Show a toast or modal to user to refresh
        const reload = confirm(
          "New content available! Click OK to update the app."
        );
        if (reload) {
          updateSW(true);
        }
      },
      onOfflineReady() {
        console.log("✅ App is ready to work offline!");
        // Show a subtle notification that offline mode is available
        const toast = document.createElement('div');
        toast.textContent = '✅ App ready for offline use';
        toast.style.cssText = `
          position: fixed;
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%);
          background: #10b981;
          color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideUp 0.3s ease;
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    },
    onRegistered(registration) {
      console.log("✅ Service Worker registered successfully");
      // Check for updates every hour
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error: unknown) {
      console.error("❌ SW registration error:", error);
    },
  });
  } catch (error) {
    console.error("❌ Failed to register service worker:", error);
  }
}

// Add online/offline event listeners
window.addEventListener('online', () => {
  console.log('✅ Back online');
  const toast = document.createElement('div');
  toast.textContent = '✅ Back online';
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: #10b981;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
});

window.addEventListener('offline', () => {
  console.log('📴 Offline mode - using cached content');
  const toast = document.createElement('div');
  toast.textContent = '📴 Offline - Your music is still available';
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: #f59e0b;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
});

// Mount the React app
try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  console.log("🚀 Mounting React app...");
  createRoot(rootElement).render(<App />);
  console.log("✅ React app mounted successfully");
} catch (error) {
  console.error("❌ Failed to mount React app:", error);
  // Show error to user
  const errorDiv = document.createElement('div');
  errorDiv.innerHTML = `
    <div style="position: fixed; inset: 0; background: #09090b; color: white; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 16px; padding: 24px; text-align: center; font-family: system-ui;">
      <h1 style="font-size: 24px; font-weight: bold; color: #ef4444;">Failed to Load MusicNest</h1>
      <p style="color: #a1a1aa; max-width: 400px;">There was an error loading the application. Please try refreshing the page.</p>
      <button onclick="location.reload()" style="padding: 12px 24px; background: #a855f7; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600;">Reload Page</button>
      <details style="margin-top: 16px; color: #71717a; font-size: 12px; max-width: 500px; text-align: left;">
        <summary style="cursor: pointer; font-weight: 600; margin-bottom: 8px;">Error Details</summary>
        <pre style="background: #18181b; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 11px;">${error}</pre>
      </details>
    </div>
  `;
  document.body.appendChild(errorDiv);
}
