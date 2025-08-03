#!/usr/bin/env node
const inquirer = require('inquirer');
const chalk = require('chalk');

// ✅ Import all backend functions from server.js
const { askClaude, saveClaudeKey, verifyLicense, writeFile, runCommand, deployTo } = require('./server');

// === CLI MENU ===
async function mainMenu() {
  console.clear();
  console.log(chalk.cyan.bold("\n🚀 VibelyCoder CLI\n"));

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        '🧠 Ask Claude',
        '🔑 Save Claude API Key',
        '📄 Write File',
        '💻 Run Command',
        '🚀 Deploy Project',
        '❌ Exit'
      ]
    }
  ]);

  switch (action) {
    case '🧠 Ask Claude':
      await askClaudeCLI();
      break;
    case '🔑 Save Claude API Key':
      await saveClaudeKeyCLI();
      break;
    case '📄 Write File':
      await writeFileCLI();
      break;
    case '💻 Run Command':
      await runCommandCLI();
      break;
    case '🚀 Deploy Project':
      await deployCLI();
      break;
    case '❌ Exit':
      console.log(chalk.green('\nGoodbye! 👋\n'));
      process.exit(0);
  }

  await mainMenu();
}

// === CLI FUNCTIONS ===

async function askClaudeCLI() {
  const { prompt } = await inquirer.prompt([
    { type: 'input', name: 'prompt', message: 'What do you want to ask Claude?' }
  ]);

  console.log(chalk.yellow("\n⏳ Asking Claude...\n"));
  const resp = await askClaude(prompt);
  console.log(chalk.green("\n✅ Claude’s Response:\n"));
  console.log(resp);
}

async function saveClaudeKeyCLI() {
  const { key } = await inquirer.prompt([
    { type: 'input', name: 'key', message: 'Enter your Claude API key:' }
  ]);

  const resp = saveClaudeKey(key);
  console.log(chalk.green(`\n${resp.message}\n`));
}

async function writeFileCLI() {
  const { sessionId, path, content } = await inquirer.prompt([
    { type: 'input', name: 'sessionId', message: 'Session ID:' },
    { type: 'input', name: 'path', message: 'File path:' },
    { type: 'editor', name: 'content', message: 'File content (editor will open):' }
  ]);

  const resp = writeFile(sessionId, path, content);
  console.log(chalk.green("\n✅ File written successfully!\n"), resp);
}

async function runCommandCLI() {
  const { sessionId, command } = await inquirer.prompt([
    { type: 'input', name: 'sessionId', message: 'Session ID:' },
    { type: 'input', name: 'command', message: 'Command to run:' }
  ]);

  console.log(chalk.yellow("\n⏳ Running command...\n"));
  const resp = await runCommand(sessionId, command);
  console.log(chalk.green("\n✅ Command output:\n"));
  console.log(resp.output);
}

async function deployCLI() {
  const { sessionId, platform } = await inquirer.prompt([
    { type: 'input', name: 'sessionId', message: 'Session ID:' },
    {
      type: 'list',
      name: 'platform',
      message: 'Where to deploy?',
      choices: ['netlify', 'vercel', 'render']
    }
  ]);

  console.log(chalk.yellow(`\n⏳ Deploying to ${platform}...\n`));
  const resp = await deployTo(platform, sessionId);
  console.log(chalk.green("\n✅ Deployment Result:\n"));
  console.log(resp);
}

// === START CLI ===
mainMenu();
