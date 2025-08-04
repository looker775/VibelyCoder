// 🔒 preload.js — Safe API Bridge for VibelyCoder
const { contextBridge, ipcRenderer } = require("electron");

// ✅ Expose a secure API to the frontend
contextBridge.exposeInMainWorld("vibelyAPI", {
  // 💬 Send a message to GPT‑4.1 / Claude (AI Chat)
  sendMessageToAI: async (msg) => {
    return await ipcRenderer.invoke("ai:chat", msg);
  },

  // 💾 Save project (HTML/CSS/JS layout from drag & drop builder)
  saveProject: async (data) => {
    return await ipcRenderer.invoke("project:save", data);
  },

  // 📂 Load project (when user reopens the app)
  loadProject: async () => {
    return await ipcRenderer.invoke("project:load");
  },

  // 🏗️ Run build (package as website/app via Vercel/Netlify/Codemagic)
  runBuild: async () => {
    return await ipcRenderer.invoke("project:build");
  },

  // 📱 Generate mobile app via GitHub push (Expo-based)
  buildMobileApp: async () => {
    return await ipcRenderer.invoke("mobile:build");
  }
});
