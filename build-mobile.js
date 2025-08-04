// build-mobile.js

const fs = require("fs");
const path = require("path");
const simpleGit = require("simple-git");

const REPO_URL = process.env.REACT_NATIVE_REPO; // e.g. https://github.com/looker775/vibelycoder-mobile
const TEMP_DIR = "temp-mobile";
const GENERATED_APP_NAME = "MyGeneratedApp"; // Change this dynamically later if needed

async function buildAndPushReactNative() {
  try {
    const git = simpleGit();

    // Clean temp folder
    if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true });

    fs.mkdirSync(TEMP_DIR, { recursive: true });

    // Basic Expo project template
    const appJson = {
      expo: {
        name: GENERATED_APP_NAME,
        slug: GENERATED_APP_NAME.toLowerCase(),
        sdkVersion: "50.0.0",
        version: "1.0.0",
        orientation: "portrait",
        platforms: ["ios", "android"],
        icon: "./assets/icon.png",
        splash: {
          image: "./assets/splash.png",
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        },
        updates: { fallbackToCacheTimeout: 0 },
        assetBundlePatterns: ["**/*"],
        ios: { supportsTablet: true },
        android: { adaptiveIcon: { foregroundImage: "./assets/adaptive-icon.png", backgroundColor: "#ffffff" } },
        web: { favicon: "./assets/favicon.png" }
      }
    };

    fs.writeFileSync(path.join(TEMP_DIR, "app.json"), JSON.stringify(appJson, null, 2));
    fs.writeFileSync(path.join(TEMP_DIR, "App.js"), `
import { Text, View } from 'react-native';
export default function App() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>🚀 This is your generated mobile app!</Text>
    </View>
  );
}
    `);

    fs.writeFileSync(path.join(TEMP_DIR, "package.json"), JSON.stringify({
      name: GENERATED_APP_NAME.toLowerCase(),
      version: "1.0.0",
      main: "node_modules/expo/AppEntry.js",
      scripts: {
        start: "expo start",
        android: "expo run:android",
        ios: "expo run:ios",
        web: "expo start --web"
      },
      dependencies: {
        expo: "~50.0.0",
        react: "18.2.0",
        "react-native": "0.73.0"
      }
    }, null, 2));

    // Init git and push
    await git.clone(REPO_URL, TEMP_DIR);
    const repoGit = simpleGit(TEMP_DIR);
    await repoGit.add(".");
    await repoGit.commit(`🚀 Auto-generated new mobile app ${GENERATED_APP_NAME}`);
    await repoGit.push("origin", "main");

    console.log("✅ Mobile app pushed to GitHub.");
  } catch (err) {
    console.error("❌ Error building mobile app:", err);
  }
}

buildAndPushReactNative();
