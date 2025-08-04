// deploy.js
const fetch = require('node-fetch');

async function deploy() {
  const renderHook = process.env.RENDER_DEPLOY_HOOK_URL;
  const vercelHook = process.env.VERCEL_DEPLOY_HOOK_URL;
  const netlifyHook = process.env.NETLIFY_DEPLOY_HOOK_URL;

  const results = [];

  async function callHook(name, url) {
    if (!url) {
      console.warn(`⚠️ ${name} deploy hook is not set.`);
      results.push(`${name} skipped (no URL)`);
      return;
    }
    try {
      const res = await fetch(url, { method: 'POST' });
      if (res.ok) {
        console.log(`✅ ${name} deployment triggered.`);
        results.push(`${name} OK`);
      } else {
        console.error(`❌ ${name} deployment failed: ${res.statusText}`);
        results.push(`${name} failed`);
      }
    } catch (err) {
      console.error(`❌ ${name} error: ${err.message}`);
      results.push(`${name} error`);
    }
  }

  await callHook('Render', renderHook);
  await callHook('Vercel', vercelHook);
  await callHook('Netlify', netlifyHook);

  return { success: true, message: 'Deployment attempted.', results };
}

if (require.main === module) {
  // CLI mode
  deploy().then((res) => {
    console.log(res);
    process.exit(0);
  });
} else {
  // Electron / preload context
  module.exports = deploy;
}
