// build-desktop.js
const { execSync } = require("child_process");
const builder = require("electron-builder");
const axios = require("axios");
require("dotenv").config();

(async () => {
  try {
    console.log("🔄 Bumping version...");
    execSync("npx standard-version --release-as patch", { stdio: "inherit" });

    console.log("🔨 Building Electron app...");
    await builder.build();

    console.log("✅ Build complete!");

    const deployHooks = {
      vercel: process.env.VERCEL_DEPLOY_HOOK_URL,
      netlify: process.env.NETLIFY_DEPLOY_HOOK_URL,
      render: process.env.RENDER_DEPLOY_HOOK_URL
    };

    for (const [platform, hook] of Object.entries(deployHooks)) {
      if (hook) {
        try {
          console.log(`🚀 Triggering deployment to ${platform}...`);
          const res = await axios.post(hook);
          console.log(`✅ ${platform} deploy triggered:`, res.status);
        } catch (err) {
          console.error(`❌ ${platform} deploy failed:`, err.message);
        }
      } else {
        console.warn(`⚠️ No hook set for ${platform}`);
      }
    }
  } catch (err) {
    console.error("❌ Build failed:", err.message);
    process.exit(1);
  }
})();
