# Windows 11 Installation Guide

## Quick Start Guide for Katechon Engine on Windows 11

### Step 1: Install Ollama (Required)

Ollama is the local AI engine that powers the Ministers and analysis features.

1. **Download Ollama for Windows**
  - Visit: [https://ollama.ai/download/windows](https://ollama.ai/download/windows)
  - Download the Windows installer (OllamaSetup.exe )

1. **Install Ollama**
  - Double-click the downloaded installer
  - Follow the installation wizard
  - Ollama will start automatically after installation

1. **Pull an AI Model**
  - Open PowerShell or Command Prompt (Win + X, then select "Windows PowerShell" or "Terminal")
  - Run one of these commands:

1. **Verify Ollama is Running**
  - Open your web browser
  - Go to: [http://localhost:11434](http://localhost:11434)
  - You should see: "Ollama is running"

### Step 2: Install Katechon Engine

#### Option A: From MSI Installer (Recommended )

1. **Build the Installer**
   - Currently, you need to build from source (see Option B below)
   - Pre-built MSI installers will be available in future releases on GitHub

1. **Run the Installer**
  - Double-click the MSI file
  - If Windows SmartScreen appears, click "More info" then "Run anyway"
  - Follow the installation wizard
  - Click "Install" (may require administrator permissions)

1. **Launch the Application**
  - Find "Katechon Engine" in your Start Menu
  - Or double-click the desktop shortcut (if created)

#### Option B: Build from Source

**Prerequisites:**

- Git for Windows: [https://git-scm.com/download/win](https://git-scm.com/download/win)

- Node.js 22+: [https://nodejs.org/](https://nodejs.org/)

- Rust: [https://rustup.rs/](https://rustup.rs/)

**Build Steps:**

```
# Open PowerShell or Terminal

# Clone the repository
git clone https://github.com/cocobeach/katechon-engine.git
cd katechon-engine

# Install pnpm (if not already installed )
npm install -g pnpm

# Install dependencies
pnpm install

# Build the application
pnpm tauri build
```

The installer will be created in: `src-tauri\target\release\bundle\msi\`

### Step 3: First Launch Configuration

1. **Launch Katechon Engine**
  - Open from Start Menu or desktop shortcut

1. **Open Settings**
  - Click the Settings icon (⚙️) in the top-right corner

1. **Configure Ollama**
  - Verify "Ollama API URL" is set to: `http://127.0.0.1:11434`
  - Set "Default Model" to the model you pulled (e.g., `llama2`, `llama3`, or `mistral` )

1. **Save Settings**
  - Click "Save Settings"

1. **Test the Connection**
  - Type a message in the chat box: "Hello, who are you?"
  - Press Enter
  - You should receive a response from The Restrainer

### Step 4: Using the Application

#### Explore the Map

- The map shows historical events (Titanic, Federal Reserve, etc.)

- Click any marker to see event details

- Click "Send to Analysis" to have Ministers analyze the event

#### Activate Ministers

- Click minister avatars in the left sidebar to toggle them

- Multiple ministers can be active for debates

- Check "Include Propagandist" for counter-arguments

#### Monitor RSS Feeds

- RSS feeds automatically poll every 5 minutes

- New events appear on the map

- Manage feeds in the RSS Feed panel on the right

#### Watch Pillar Health

- Six Pillars Health panel shows real-time societal health

- Analyzing content affects pillar health

- Green = healthy, Red = damaged

## Troubleshooting

### Issue: "Ollama connection failed"

**Solution:**

1. Open PowerShell and run: `ollama serve`

1. Verify Ollama is running: [http://localhost:11434](http://localhost:11434)

1. Check Windows Firewall settings

1. Restart Katechon Engine

### Issue: "Model not found"

**Solution:**

1. Open PowerShell

1. Check available models: `ollama list`

1. Pull the model: `ollama pull llama2`

1. Update model name in Settings

### Issue: Application won't start

**Solution:**

1. Check Windows Event Viewer for errors

1. Ensure .NET Framework is installed

1. Run as Administrator

1. Reinstall the application

### Issue: Map not loading

**Solution:**

1. Check internet connection

1. Disable VPN temporarily

1. Check Windows Firewall

1. Restart application

### Issue: RSS feeds not updating

**Solution:**

1. Verify internet connection

1. Check feed URLs in Settings

1. Some feeds may be temporarily down

1. Try disabling/re-enabling feeds

## System Requirements

### Minimum Requirements

- Windows 10 (version 1903 or later ) or Windows 11

- 8GB RAM

- 10GB free disk space

- Internet connection

- Ollama with at least one model installed

### Recommended Requirements

- Windows 11

- 16GB RAM

- 20GB free disk space

- SSD for better performance

- Dedicated GPU (for larger Ollama models)

## Performance Tips

### For Better AI Response Speed

1. Use smaller models (llama2, mistral)

1. Close other applications

1. Ensure Ollama has sufficient RAM

### For Better Map Performance

1. Disable unused RSS feeds

1. Clear old events periodically

1. Use a modern GPU

### For Lower Resource Usage

1. Use llama2 instead of llama3

1. Disable debate mode when not needed

1. Reduce number of active ministers

## Uninstallation

1. **Using Windows Settings**
  - Open Settings (Win + I)
  - Go to Apps > Installed apps
  - Find "Katechon Engine"
  - Click "..." and select "Uninstall"

1. **Using Control Panel**
  - Open Control Panel
  - Go to Programs > Programs and Features
  - Find "Katechon Engine"
  - Right-click and select "Uninstall"

## Security Notes

- All AI processing happens locally via Ollama

- No data is sent to external servers (except RSS feed fetching)

- Your analysis and chat history stays on your machine

- Stripe integration is for future payment features only (MVP is free)

## Getting Help

- Check the main README.md for detailed documentation

- Review troubleshooting section above

- Open an issue on GitHub

- Check Ollama documentation: [https://ollama.ai/docs](https://ollama.ai/docs)

---

**Welcome to the Katechon Engine. The Restrainer awaits your investigation.**

