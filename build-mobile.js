import fetch from "node-fetch";

export async function buildMobileApp(folder) {
  try {
    console.log("📲 Sending Flutter code to Codemagic...");
    const response = await fetch("https://api.codemagic.io/builds", {
      method: "POST",
      headers: {
        "x-auth-token": process.env.CODEMAGIC_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        appId: process.env.CODEMAGIC_APP_ID,
        branch: "main",
        workflowId: "default"
      })
    });
    const data = await response.json();
    return { message: "Mobile build started", codemagic: data };
  } catch (err) {
    console.error("❌ Mobile build failed", err);
    return { error: err.message };
  }
}
