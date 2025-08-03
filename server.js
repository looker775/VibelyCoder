const fs = require('fs');
const path = require('path');
const axios = require('axios');
const AdmZip = require('adm-zip');
const { spawn } = require('child_process');
const dotenv = require('dotenv');
const { AnthropicClient } = require('@anthropic-ai/sdk');

dotenv.config();

// === CONFIG ===
const PROJECTS_ROOT = path.join(process.cwd(), 'user-projects');
if (!fs.existsSync(PROJECTS_ROOT)) fs.mkdirSync(PROJECTS_ROOT);

const GUMROAD_PRODUCT_PERMALINK = process.env.GUMROAD_PRODUCT_PERMALINK || "otterf";
let claudeKey = process.env.CLAUDE_API_KEY || null;

// === CORE FUNCTIONS ===

// 🧠 Claude
async function askClaude(prompt) {
  if (!claudeKey) return '❌ Please set a Claude API key first (.env or via UI).';

  try {
    const client = new AnthropicClient({ apiKey: claudeKey });
    const resp = await client.messages.create({
      model: 'claude-3-opus-20240229',
      messages: [{ role: "user", content: prompt }]
    });
    return resp;
  } catch (err) {
    return `❌ Claude error: ${err.message}`;
  }
}

// 🔑 Save Claude API Key
function saveClaudeKey(key) {
  claudeKey = key.trim();
  return { success: !!claudeKey, message: claudeKey ? '✅ Claude key saved' : '❌ Empty key' };
}

// 🔑 Verify Gumroad License
async function verifyLicense(key) {
  try {
    const { data } = await axios.post('https://api.gumroad.com/v2/licenses/verify', null, {
      params: { product_permalink: GUMROAD_PRODUCT_PERMALINK, license_key: key }
    });
    if (!data.success) return { success: false, message: "❌ Invalid key" };
    const p = data.purchase;
    if (p.refunded || p.chargebacked) return { success: false, message: "❌ Refunded" };
    return p.subscription_ended_at === null
      ? { success: true, message: "✅ Active subscription" }
      : { success: false, message: `❌ Expired on ${p.subscription_ended_at}` };
  } catch (e) {
    return { success: false, message: "❌ Gumroad API error" };
  }
}

// 📄 File Write
function writeFile(sessionId, relPath, content) {
  const dir = path.join(PROJECTS_ROOT, sessionId, path.dirname(relPath));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(PROJECTS_ROOT, sessionId, relPath), content, 'utf8');
  return { success: true };
}

// 💻 Run shell command
function runCommand(sessionId, command, args = []) {
  return new Promise(resolve => {
    const cwd = path.join(PROJECTS_ROOT, sessionId);
    const pr = spawn(command, args, { cwd, shell: true });
    let out = '';
    pr.stdout.on('data', d => out += d);
    pr.stderr.on('data', d => out += d);
    pr.on('close', code => resolve({ code, output: out }));
  });
}

// === ZIP HELPER ===
async function zipFolder(dir) {
  const zip = new AdmZip();
  zip.addLocalFolder(dir);
  const zipPath = path.join(path.dirname(dir), 'deploy.zip');
  zip.writeZip(zipPath);
  return zipPath;
}

// === DEPLOYMENT FUNCTIONS ===
async function deployNetlify(dir) {
  const token = process.env.NETLIFY_AUTH_TOKEN;
  if (!token) throw new Error('❌ NETLIFY_AUTH_TOKEN missing in .env');

  const zip = await zipFolder(dir);

  const { data: site } = await axios.post(
    'https://api.netlify.com/api/v1/sites',
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

  await axios.post(
    `https://api.netlify.com/api/v1/sites/${site.site_id}/deploys`,
    fs.createReadStream(zip),
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/zip' } }
  );

  return { success: true, url: site.ssl_url };
}

async function deployVercel(dir) {
  const token = process.env.VERCEL_AUTH_TOKEN;
  if (!token) throw new Error('❌ VERCEL_AUTH_TOKEN missing in .env');

  const zip = await zipFolder(dir);

  const { data: deployment } = await axios.post(
    'https://api.vercel.com/v13/deployments',
    { target: 'production' },
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
  );

  await axios.patch(
    `https://api.vercel.com/v13/deployments/${deployment.id}/files`,
    fs.createReadStream(zip),
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/zip' } }
  );

  return { success: true, url: `https://${deployment.url}` };
}

async function deployRender(dir) {
  const token = process.env.RENDER_AUTH_TOKEN;
  const serviceId = process.env.RENDER_SERVICE_ID;
  if (!token) throw new Error('❌ RENDER_AUTH_TOKEN missing in .env');
  if (!serviceId) throw new Error('❌ RENDER_SERVICE_ID missing in .env');

  const zip = await zipFolder(dir);

  const { data: artifact } = await axios.post(
    'https://api.render.com/v1/artifacts',
    { serviceId },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  await axios.put(artifact.uploadUrl, fs.createReadStream(zip), {
    headers: { 'Content-Type': 'application/zip' }
  });

  await axios.post(
    `https://api.render.com/v1/services/${serviceId}/deploys`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return { success: true, url: artifact.serviceUrl };
}

async function deployTo(platform, sessionId) {
  try {
    const handlers = { netlify: deployNetlify, vercel: deployVercel, render: deployRender };
    return await handlers[platform](path.join(PROJECTS_ROOT, sessionId || ""));
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// === MESSAGE HANDLER FOR MAIN.JS ===
process.on('message', async (msg) => {
  const { channel, args } = msg;

  let response;
  try {
    switch (channel) {
      case 'askClaude': response = await askClaude(...args); break;
      case 'verify-license': response = await verifyLicense(...args); break;
      case 'saveClaudeKey': response = saveClaudeKey(...args); break;
      case 'writeFile': response = writeFile(...args); break;
      case 'runCommand': response = await runCommand(...args); break;
      case 'deployTo': response = await deployTo(...args); break;
      default: response = { success: false, message: `❌ Unknown channel: ${channel}` };
    }
  } catch (err) {
    response = { success: false, message: err.message };
  }

  process.send({ channel, response });
});

// ✅ Export for CLI usage
module.exports = { askClaude, saveClaudeKey, verifyLicense, writeFile, runCommand, deployTo };
