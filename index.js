import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import { Configuration, OpenAIApi } from "openai";
import { deployWebsite } from "./deploy.js";
import { buildMobileApp } from "./build-mobile.js";
import { buildDesktopApp } from "./build-desktop.js";

dotenv.config();
const app = express();
app.use(express.json());

const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_KEY }));

// 🟢 Endpoint: user sends prompt → AI writes code → deploy
app.post("/generate", async (req, res) => {
  try {
    const { prompt, type } = req.body;

    // 👉 Step 1: Ask AI to write code
    const aiResponse = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "You write production code." },
                 { role: "user", content: `Make a ${type} app: ${prompt}` }]
    });

    const code = aiResponse.data.choices[0].message.content;

    // 👉 Step 2: Save code to correct template folder
    let folder = `./templates/${type}`;
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(`${folder}/app.txt`, code);

    // 👉 Step 3: Deploy or build
    let result;
    if (type === "website") {
      result = await deployWebsite(folder);
    } else if (type === "mobile") {
      result = await buildMobileApp(folder);
    } else if (type === "desktop") {
      result = await buildDesktopApp(folder);
    }

    res.json({ success: true, deployment: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("🚀 VibelyCoder backend running on port 3000"));
