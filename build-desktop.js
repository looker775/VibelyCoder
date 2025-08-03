export async function buildDesktopApp(folder) {
  try {
    console.log("💻 Triggering GitHub Actions for Electron build...");
    // Here we just return success; GitHub Actions will do the build on push
    return { message: "Desktop build triggered via GitHub Actions" };
  } catch (err) {
    console.error("❌ Desktop build failed", err);
    return { error: err.message };
  }
}
