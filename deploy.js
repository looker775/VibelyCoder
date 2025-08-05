import simpleGit from "simple-git";
import fetch from "node-fetch";

export async function deployWebsite(folder) {
  try {
    console.log("📤 Deploying website to GitHub + Vercel...");
    const git = simpleGit();

    // Initialize repo if not already
    await git.init();
    await git.addRemote("origin", process.env.GITHUB_REPO_URL).catch(() => {});
    await git.add(".");
    await git.commit("AI: Generated website");
    await git.push("origin", "main", ["--force"]);

    // Trigger Vercel deployment
    const vercelDeploy = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "vibelycoder",
        gitSource: { type: "github", repoId: process.env.GITHUB_REPO_ID }
      })
    }).then(r => r.json());

    return { url: vercelDeploy.url };
  } catch (err) {
    console.error("❌ Website deploy failed", err);
    return { error: err.message };
  }
}
