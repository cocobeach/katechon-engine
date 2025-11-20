# Katechon Engine

**An AI-Driven Research, Investigation, and Information Analysis Platform**

The Katechon Engine is a powerful desktop application built with Tauri, React, and Rust that helps you analyze information through the lens of ideological subversion, using the wisdom of renowned thinkers like Yuri Bezmenov, Alexander Solzhenitsyn, Anthony C. Sutton, Eustace Mullins, Thomas Sowell, and Carl Schmitt.

## Features

### 🗺️ Interactive Map Visualization
- Real-time plotting of RSS feed events on a 3D world map
- Historical timeline with pre-seeded conspiracy events (Titanic, Federal Reserve, etc.)
- Color-coded markers based on Katechon tier scoring (0-9)
- Click events to analyze and send to AI Ministers

### 🤖 Multi-Persona AI Chat System
- **The Restrainer**: Composite AI embodying all six philosophers
- **Seven Ministers**: Specialized AI personas for each pillar
  - 💰 The Economist (Economy)
  - ⚖️ The Judge (Legal)
  - 📚 The Scholar (Education)
  - 🛡️ The Guardian (Family)
  - 📰 The Journalist (Media)
  - ✝️ The Chaplain (Spirituality)
  - 👁️ The Witness (All Pillars)
- **The Propagandist**: Marxist critical theorist for debate mode
- Toggle multiple Ministers for multi-perspective debates

### 📊 Six Pillars Health System
Real-time tracking of societal health across:
- Economy
- Spirituality
- Family
- Education
- Media
- Legal

### 📡 RSS Feed Integration
- Pre-configured feeds from alternative and mainstream sources
- Automatic polling every 5 minutes
- Smart geolocation detection from article content
- Filterable by category with nested visualization
- Add custom RSS feeds

### 🎯 Katechon Tier Scoring (0-100)
- **Tier 0**: Terrorist/Accelerationist (-15% pillar impact)
- **Tier 1**: Controlled Chaos Agent (-5%) - MOST DANGEROUS
- **Tier 2**: Useful Idiot/NGO Drone (+1%/-5%)
- **Tier 3**: Confused Normie (+2%)
- **Tier 4-6**: Right but Lazy → Competent (+3% to +5.5%)
- **Tier 7-8**: Insightful → Vigilant (+7% to +9%)
- **Tier 9**: Genius/True Katechon (+12% to +18%)

## System Requirements

### Windows 11 (Recommended) or Windows 10
- 8GB RAM minimum (16GB recommended for larger LLM models)
- 10GB free disk space
- Internet connection for RSS feeds

### Ollama (Required)
The application requires a local Ollama instance for AI functionality.

1. **Download Ollama**: Visit [ollama.ai](https://ollama.ai) and download the Windows installer
2. **Install Ollama**: Run the installer and follow the setup wizard
3. **Pull a Model**: Open PowerShell or Command Prompt and run:
   ```bash
   ollama pull llama2
   # Or use other models:
   ollama pull llama3
   ollama pull mistral
   ollama pull mixtral
   ```
4. **Verify Installation**: Ollama should be running at `http://127.0.0.1:11434`

## Installation

### Option 1: Install Pre-built Windows Package (Recommended)

1. Download the latest `.msi` installer from the releases
2. Double-click the installer and follow the setup wizard
3. Launch "Katechon Engine" from your Start Menu

### Option 2: Build from Source

#### Prerequisites
- [Node.js 22+](https://nodejs.org/)
- [Rust](https://rustup.rs/)
- [pnpm](https://pnpm.io/)

#### Build Steps

```bash
# Clone the repository
git clone <repository-url>
cd katechon-engine

# Install dependencies
pnpm install

# Build the application
pnpm tauri build
```

The installer will be created in `src-tauri/target/release/bundle/msi/`

## Usage

### First Launch

1. **Configure Ollama**: Click the Settings icon (⚙️) in the top right
2. **Verify Ollama URL**: Default is `http://127.0.0.1:11434`
3. **Set Model**: Enter your preferred model (e.g., `llama2`, `llama3`, `mistral`)
4. **Save Settings**

### Analyzing Content

#### Method 1: From Map Events
1. Click any event marker on the map
2. Click "Send to Analysis" button
3. The active Ministers will analyze the event

#### Method 2: Direct Chat Input
1. Type or paste content into the chat box
2. Press Enter or click Send
3. Get instant analysis from The Restrainer or active Ministers

#### Method 3: RSS Feed Events
1. RSS feeds are automatically polled every 5 minutes
2. New events appear on the map
3. Click to analyze

### Using Ministers

1. **Toggle Ministers**: Click minister avatars in the left sidebar
2. **Single Minister**: Get focused analysis from one perspective
3. **Multiple Ministers**: Enable debate mode with multiple viewpoints
4. **Include Propagandist**: Check "Include Propagandist" for counter-arguments

### Managing RSS Feeds

1. Navigate to the RSS Feed panel on the right
2. Expand categories to see feeds
3. Toggle checkboxes to enable/disable feeds
4. Click + to add custom feeds
5. Feeds are organized by category (Alternative, Mainstream, Government, Custom)

### Monitoring Pillar Health

- Watch the Six Pillars Health panel in real-time
- Health increases with high-tier content analysis
- Health decreases with low-tier content
- Color-coded: Green (70%+), Yellow (40-69%), Orange (20-39%), Red (<20%)

## Configuration

### Admin Settings

Access via the Settings icon (⚙️) in the top-right corner:

- **Ollama API URL**: Local Ollama endpoint (default: `http://127.0.0.1:11434`)
- **Default Model**: LLM model to use (e.g., `llama2`, `llama3`, `mistral`)
- **Stripe Publishable Key**: For future payment integration (MVP is free)

### RSS Feed Sources (Pre-configured)

**Alternative Media:**
- ZeroHedge
- The Grayzone
- Unlimited Hangout
- Global Research
- Brownstone Institute
- Antiwar.com

**Mainstream:**
- Reuters World News

**Government:**
- Federal Register

## Development

### Run in Development Mode

```bash
pnpm tauri dev
```

### Project Structure

```
katechon-engine/
├── src/                      # React frontend
│   ├── components/          # UI components
│   │   ├── Map.tsx         # Maplibre GL map
│   │   ├── Chat.tsx        # AI chat interface
│   │   ├── MinisterSidebar.tsx
│   │   ├── RSSFeedPanel.tsx
│   │   ├── PillarHealth.tsx
│   │   └── Settings.tsx
│   ├── store/              # Zustand state management
│   │   └── useStore.ts
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── lib.rs         # Main Tauri app
│   │   ├── ollama.rs      # Ollama API integration
│   │   └── rss.rs         # RSS feed fetching
│   └── tauri.conf.json    # Tauri configuration
└── package.json
```

### Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Desktop**: Tauri 2.x (Rust-based)
- **Map**: Maplibre GL JS + Deck.gl
- **State**: Zustand
- **Styling**: Tailwind CSS
- **AI**: Local Ollama integration
- **RSS**: feed-rs (Rust)

## Troubleshooting

### Ollama Connection Issues
- Verify Ollama is running: Open browser to `http://127.0.0.1:11434`
- Check firewall settings
- Ensure model is pulled: `ollama list`

### Map Not Loading
- Check internet connection
- Clear browser cache
- Restart application

### RSS Feeds Not Updating
- Verify internet connection
- Check feed URLs in Settings
- Some feeds may be temporarily unavailable

## License

This is a free MVP version for testing purposes. Commercial licensing will be available in future releases.

## Credits

Built with inspiration from:
- **Yuri Bezmenov** - Ideological subversion framework
- **Alexander Solzhenitsyn** - Testimony of ideological capture
- **Anthony C. Sutton** - Financial-technological analysis
- **Eustace Mullins** - Central banking research
- **Thomas Sowell** - Empirical analysis
- **Carl Schmitt** - Katechon concept

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Built with Tauri + React + Rust for Windows 11**

*The Restrainer awaits your investigation...*
