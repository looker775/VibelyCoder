<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🚀 VibelyCoder</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    header {
      background: #1f1f1f;
      color: white;
      padding: 10px 20px;
      font-size: 20px;
      font-weight: bold;
      text-align: center;
    }
    main {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    nav {
      width: 200px;
      background: #2d2d2d;
      color: white;
      display: flex;
      flex-direction: column;
      padding: 15px;
    }
    nav button {
      background: #3d3d3d;
      color: white;
      padding: 10px;
      margin-bottom: 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }
    nav button:hover {
      background: #505050;
    }
    section {
      flex: 1;
      padding: 20px;
      display: none;
      overflow-y: auto;
      background: white;
    }
    section.active {
      display: block;
    }
    #ai-chat {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    #chat-log {
      flex: 1;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 10px;
      overflow-y: auto;
      background: #fafafa;
      margin-bottom: 10px;
    }
    #chat-input {
      display: flex;
    }
    #chat-input input {
      flex: 1;
      padding: 10px;
      border-radius: 5px 0 0 5px;
      border: 1px solid #ccc;
      border-right: none;
    }
    #chat-input button {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 0 5px 5px 0;
      background: #1f1f1f;
      color: white;
      cursor: pointer;
    }
    #builder-canvas {
      border: 2px dashed #ccc;
      height: 500px;
      margin-top: 10px;
      padding: 10px;
      background: #fafafa;
    }
    .drag-item {
      padding: 10px;
      background: #e0e0e0;
      margin: 5px;
      cursor: grab;
      border-radius: 5px;
    }
    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
    .builder-actions {
      margin-bottom: 10px;
    }
    .builder-actions button {
      margin-right: 10px;
      padding: 8px 12px;
      background: #1f1f1f;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    .builder-actions button:hover {
      background: #333;
    }
  </style>

  <!-- ✅ Add preload bridge fallback in case Electron is not injected -->
  <script>
    if (!window.vibelyAPI) {
      window.vibelyAPI = {
        sendMessageToAI: async (msg) => "⚠️ Backend not available",
        saveProject: async () => ({ success: false, error: "Backend missing" }),
        loadProject: async () => ({ success: false, error: "Backend missing" }),
        runBuild: async () => ({ success: false, error: "Backend missing" })
      };
    }
  </script>
</head>
<body>
  <header>🚀 VibelyCoder</header>

  <main>
    <nav>
      <button onclick="showSection('chat')">💬 AI Chat</button>
      <button onclick="showSection('builder')">🎨 Drag & Drop Builder</button>
      <button onclick="showSection('preview')">👀 Live Preview</button>
    </nav>

    <!-- Section 1: AI Chat -->
    <section id="chat" class="active">
      <h2>💬 Chat with AI</h2>
      <div id="ai-chat">
        <div id="chat-log"></div>
        <div id="chat-input">
          <input type="text" id="chatMessage" placeholder="Ask the AI anything..." />
          <button onclick="sendMessage()">Send</button>
        </div>
      </div>
    </section>

    <!-- Section 2: Drag & Drop Builder -->
    <section id="builder">
      <h2>🎨 Drag & Drop Builder</h2>
      <div class="builder-actions">
        <button onclick="saveProject()">💾 Save Project</button>
        <button onclick="loadProject()">📂 Load Project</button>
        <button onclick="triggerBuild()">🚀 Build & Deploy</button>
      </div>

      <p>Drag items into the canvas below:</p>
      <div style="display:flex;">
        <div>
          <div class="drag-item" draggable="true" data-type="text">Text Block</div>
          <div class="drag-item" draggable="true" data-type="image">Image</div>
          <div class="drag-item" draggable="true" data-type="video">Video</div>
        </div>
        <div id="builder-canvas" ondrop="drop(event)" ondragover="allowDrop(event)">
          <p>Drop components here...</p>
        </div>
      </div>
    </section>

    <!-- Section 3: Live Preview -->
    <section id="preview">
      <h2>👀 Live Preview</h2>
      <iframe id="previewFrame" srcdoc="<h2 style='text-align:center;'>Your App Preview Will Show Here</h2>"></iframe>
    </section>
  </main>

<script>
  function showSection(section) {
    document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(section).classList.add('active');
  }

  async function sendMessage() {
    const msg = document.getElementById('chatMessage').value;
    if (!msg.trim()) return;

    const chatLog = document.getElementById('chat-log');
    chatLog.innerHTML += `<div><b>You:</b> ${msg}</div>`;
    document.getElementById('chatMessage').value = '';
    chatLog.scrollTop = chatLog.scrollHeight;

    chatLog.innerHTML += `<div><i>🤖 AI is thinking...</i></div>`;
    chatLog.scrollTop = chatLog.scrollHeight;

    const reply = await window.vibelyAPI.sendMessageToAI(msg);
    chatLog.innerHTML = chatLog.innerHTML.replace(`<div><i>🤖 AI is thinking...</i></div>`, "");
    chatLog.innerHTML += `<div><b>AI:</b> ${reply}</div>`;
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function allowDrop(ev) { ev.preventDefault(); }

  function drop(ev) {
    ev.preventDefault();
    const type = ev.dataTransfer.getData("text/plain") || "text";
    const canvas = document.getElementById("builder-canvas");
    if (type === "text") {
      canvas.innerHTML += "<p contenteditable='true'>✍ Editable Text</p>";
    } else if (type === "image") {
      canvas.innerHTML += "<img src='https://via.placeholder.com/150' style='display:block;margin:10px 0;' />";
    } else if (type === "video") {
      canvas.innerHTML += "<video src='' controls style='width:100%;margin:10px 0;'>Video here</video>";
    }
  }

  document.querySelectorAll(".drag-item").forEach(item => {
    item.addEventListener("dragstart", ev => {
      ev.dataTransfer.setData("text/plain", item.dataset.type);
    });
  });

  async function saveProject() {
    const html = document.getElementById("builder-canvas").innerHTML;
    const res = await window.vibelyAPI.saveProject({ html });
    alert(res.success ? "✅ Project saved!" : "❌ Save failed: " + res.error);
  }

  async function loadProject() {
    const res = await window.vibelyAPI.loadProject();
    if (res.success) {
      document.getElementById("builder-canvas").innerHTML = res.data?.html || "<p>📝 No saved content</p>";
      alert("📂 Project loaded!");
    } else {
      alert("⚠️ " + res.error);
    }
  }

  async function triggerBuild() {
    const res = await window.vibelyAPI.runBuild();
    alert(res.success ? res.message : "❌ Build failed: " + res.error);
  }
</script>
</body>
</html>
