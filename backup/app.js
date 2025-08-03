#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

console.log("✅ VibelyCoder starting...");

// 📂 Создаём отдельную папку для данных программы (в AppData на Windows)
const userDataPath = path.join(process.env.APPDATA || __dirname, "VibelyCoder");
if (!fs.existsSync(userDataPath)) {
  fs.mkdirSync(userDataPath, { recursive: true });
}

// 📂 Пути для хранения файлов
const keysFile = path.join(userDataPath, "keys.json");
const activatedFile = path.join(userDataPath, "activated.json");

// ✅ Если keys.json ещё не скопирован → скопировать его из exe в AppData
const originalKeysPath = path.join(__dirname, "keys.json");
if (!fs.existsSync(keysFile) && fs.existsSync(originalKeysPath)) {
  fs.copyFileSync(originalKeysPath, keysFile);
}

// ✅ Читаем ключи
let validKeys = [];
if (fs.existsSync(keysFile)) {
  validKeys = JSON.parse(fs.readFileSync(keysFile, "utf-8"));
} else {
  console.log("❌ keys.json не найден! Создай файл с ключами.");
  process.exit(1);
}

// ✅ Если ключ уже активирован на этом ПК — сразу запускаем
if (fs.existsSync(activatedFile)) {
  console.log("✅ Приложение уже активировано на этом ПК.");
  startApp();
} else {
  askLicense();
}

function askLicense() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("🔑 Enter your VibelyCoder License Key: ", function (key) {
    if (validKeys.includes(key)) {
      console.log("✅ License activated! Welcome to VibelyCoder.");

      // Удаляем ключ из списка
      validKeys = validKeys.filter(k => k !== key);
      fs.writeFileSync(keysFile, JSON.stringify(validKeys, null, 2));

      // Сохраняем активацию
      fs.writeFileSync(activatedFile, JSON.stringify({ key, date: new Date() }, null, 2));

      rl.close();
      startApp();
    } else {
      console.log("❌ Invalid license. Please restart and try again.");
      rl.close();
    }
  });
}

function startApp() {
  console.log("🚀 App is now running!");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("💬 Type something for the AI: ", function (msg) {
    console.log("🤖 VibelyCoder: AI reply would go here.");
    rl.close();
  });
}
