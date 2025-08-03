#!/usr/bin/env node

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
require('dotenv').config(); // ✅ Load .env automatically

// === 🌍 GLOBAL VARIABLES ===
let mainWindow;
const userDataPath = path.join(process.env.APPDATA || __dirname, 'VibelyCoder');
if (!fs.existsSync(userDataPath)) {
  fs.mkdirSync(userDataPath, { recursive: true });
}

const projectFile = path.join(userDataPath, 'project.json');

// === 🚀 ELECTRON MAIN WINDOW ===
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const indexPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexPath)) {
    mainWindow.loadFile(indexPath);
  } else {
    mainWindow.loadURL('data:text/html;charset=utf-8,' +
      encodeURIComponent('<h1>🚀 VibelyCoder Dev Window</h1><p>index.html not found</p>'));
  }

  // 👀 DevTools auto-open in dev mode
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  console.log("✅ Electron ready");
  createWindow();
});

// ✅ Quit app when all windows closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// === 💬 AI CHAT HANDLER (GPT‑4.1 + Claude) ===
ipcMain.handle('ai:chat', async (event, msg) => {
  console.log(`🤖 User asked AI: ${msg}`);
  try {
    // --- Option 1: GPT‑4.1 (OpenAI API)
    const openai = (await import('openai')).default;
    const client = new openai({ apiKey: process.env.OPENAI_KEY });

    const response = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: msg }]
    });

    return response.choices[0].message.content;

    // --- Option 2: Claude (Anthropic API) – keep for fallback
    // const fetch = (await import('node-fetch')).default;
    // const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "x-api-key": process.env.CLAUDE_API_KEY
    //   },
    //   body: JSON.stringify({
    //     model: "claude-3-opus-20240229",
    //     max_tokens: 400,
    //     messages: [{ role: "user", content: msg }]
    //   })
    // });
    // const claudeData = await claudeRes.json();
    // return claudeData.content[0].text;
  } catch (err) {
    console.error("❌ AI Chat Error:", err);
    return "⚠️ Error connecting to AI model.";
  }
});

// === 💾 SAVE PROJECT HANDLER ===
ipcMain.handle('project:save', async (event, data) => {
  try {
    fs.writeFileSync(projectFile, JSON.stringify(data, null, 2));
    console.log("✅ Project saved:", projectFile);
    return { success: true };
  } catch (err) {
    console.error("❌ Save project failed:", err);
    return { success: false, error: err.message };
  }
});

// === 📂 LOAD PROJECT HANDLER ===
ipcMain.handle('project:load', async () => {
  try {
    if (fs.existsSync(projectFile)) {
      const content = JSON.parse(fs.readFileSync(projectFile, 'utf-8'));
      console.log("📂 Project loaded.");
      return { success: true, data: content };
    }
    return { success: false, error: "No project saved yet." };
  } catch (err) {
    console.error("❌ Load project failed:", err);
    return { success: false, error: err.message };
  }
});

// === 🏗️ BUILD HANDLER (placeholder for API triggers) ===
ipcMain.handle('project:build', async () => {
  try {
    console.log("🚀 Build triggered...");

    // ✅ In future: trigger APIs for Vercel, Netlify, Render, Codemagic
    // Example: send API request to Vercel to deploy

    return { success: true, message: "✅ Build started via Vercel/Netlify placeholder." };
  } catch (err) {
    console.error("❌ Build failed:", err);
    return { success: false, error: err.message };
  }
});
