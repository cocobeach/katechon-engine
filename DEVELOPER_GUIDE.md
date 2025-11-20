# Developer Guide - Katechon Engine

## Development Environment Setup

### Prerequisites

1. **Node.js 22+**
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **pnpm**
   - Install: `npm install -g pnpm`
   - Verify: `pnpm --version`

3. **Rust**
   - Download from: https://rustup.rs/
   - Verify: `rustc --version` and `cargo --version`

4. **Ollama**
   - Download from: https://ollama.ai
   - Pull a model: `ollama pull llama2`

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd katechon-engine

# Install dependencies
pnpm install

# Run in development mode
pnpm tauri dev
```

## Project Architecture

### Frontend (React + TypeScript)

```
src/
├── components/          # React components
│   ├── Map.tsx         # Maplibre GL map with event markers
│   ├── Chat.tsx        # AI chat interface with Ollama
│   ├── MinisterSidebar.tsx  # Minister selection sidebar
│   ├── RSSFeedPanel.tsx     # RSS feed management
│   ├── PillarHealth.tsx     # Six Pillars health display
│   └── Settings.tsx         # Admin settings modal
├── store/
│   └── useStore.ts     # Zustand global state management
├── App.tsx             # Main application component
├── main.tsx            # React entry point
└── index.css           # Global styles with Tailwind
```

### Backend (Rust + Tauri)

```
src-tauri/src/
├── lib.rs              # Main Tauri application
├── ollama.rs           # Ollama API integration
└── rss.rs              # RSS feed fetching and parsing
```

## State Management (Zustand)

### Global State Structure

```typescript
interface AppState {
  // Map events
  mapEvents: MapEvent[];
  selectedEvent: MapEvent | null;
  
  // Ministers
  ministers: Minister[];
  activeMinisterIds: string[];
  
  // Chat
  chatMessages: ChatMessage[];
  
  // RSS Feeds
  rssFeeds: RSSFeed[];
  
  // Pillar Health
  pillarsHealth: {
    economy: number;
    spirituality: number;
    family: number;
    education: number;
    media: number;
    legal: number;
  };
  
  // Settings
  ollamaUrl: string;
  ollamaModel: string;
  stripePublicKey: string;
  
  // UI State
  currentTab: 'map' | 'persona-studio';
  sidebarCollapsed: boolean;
}
```

### Key Actions

- `addMapEvent(event)` - Add event to map
- `toggleMinister(id)` - Toggle minister active state
- `addChatMessage(message)` - Add message to chat
- `updatePillarHealth(pillar, delta)` - Update pillar health

## Tauri Commands (Rust ↔ React)

### Ollama Integration

```rust
#[tauri::command]
pub async fn call_ollama(
    url: String,
    model: String,
    system_prompt: String,
    user_message: String,
) -> Result<String, String>
```

**Usage in React:**
```typescript
const response = await invoke<string>('call_ollama', {
  url: 'http://127.0.0.1:11434',
  model: 'llama2',
  systemPrompt: RESTRAINER_SYSTEM_PROMPT,
  userMessage: 'Analyze this content...',
});
```

### RSS Feed Fetching

```rust
#[tauri::command]
pub async fn fetch_rss_feed(url: String) -> Result<Vec<RSSItem>, String>
```

**Usage in React:**
```typescript
const items = await invoke<RSSItem[]>('fetch_rss_feed', {
  url: 'https://www.zerohedge.com/rss/all',
});
```

### Location Guessing

```rust
#[tauri::command]
pub async fn guess_location_from_text(text: String) -> Result<(f64, f64), String>
```

## Adding New Features

### Adding a New Minister

1. **Update Store** (`src/store/useStore.ts`):
```typescript
ministers: [
  // ... existing ministers
  { 
    id: 'new_minister', 
    name: 'The New Minister', 
    avatar: '🆕', 
    pillar: 'custom', 
    active: false, 
    color: '#FF00FF' 
  },
]
```

2. **Add System Prompt** (`src/components/Chat.tsx`):
```typescript
const MINISTER_PROMPTS: Record<string, string> = {
  // ... existing prompts
  new_minister: `You are The New Minister, focusing on...`,
};
```

### Adding a New RSS Feed

1. **Update Default Feeds** (`src/store/useStore.ts`):
```typescript
rssFeeds: [
  // ... existing feeds
  { 
    url: 'https://example.com/feed', 
    name: 'Example Feed', 
    category: 'Custom', 
    enabled: true, 
    color: '#00FF00' 
  },
]
```

### Adding a New Tauri Command

1. **Create Rust Function** (`src-tauri/src/custom.rs`):
```rust
#[tauri::command]
pub async fn my_custom_command(param: String) -> Result<String, String> {
    // Implementation
    Ok("Success".to_string())
}
```

2. **Register Command** (`src-tauri/src/lib.rs`):
```rust
mod custom;
use custom::my_custom_command;

// In run() function:
.invoke_handler(tauri::generate_handler![
    call_ollama,
    fetch_rss_feed,
    guess_location_from_text,
    my_custom_command  // Add here
])
```

3. **Use in React**:
```typescript
const result = await invoke<string>('my_custom_command', { param: 'value' });
```

## Testing

### Manual Testing Checklist

- [ ] Map loads with initial historical events
- [ ] RSS feeds poll and add new events
- [ ] Ministers can be toggled on/off
- [ ] Chat sends messages to Ollama
- [ ] Pillar health updates based on analysis
- [ ] Settings can be saved and loaded
- [ ] Event markers are clickable
- [ ] "Send to Analysis" button works
- [ ] Debate mode includes Propagandist

### Testing Ollama Integration

```bash
# Test Ollama directly
curl http://localhost:11434/api/generate -d '{
  "model": "llama2",
  "prompt": "Hello, who are you?",
  "stream": false
}'
```

## Building for Production

### Development Build

```bash
pnpm tauri dev
```

### Production Build (Windows)

```bash
# Using PowerShell script
.\build-windows.ps1

# Or manually
pnpm tauri build
```

Output: `src-tauri/target/release/bundle/msi/`

### Build Configuration

Edit `src-tauri/tauri.conf.json`:

```json
{
  "productName": "Katechon Engine",
  "version": "1.0.0",
  "identifier": "com.katechon.engine",
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": ["icons/icon.ico"]
  }
}
```

## Performance Optimization

### Frontend Optimization

1. **Lazy Load Components**
```typescript
const Map = lazy(() => import('./components/Map'));
```

2. **Memoize Expensive Calculations**
```typescript
const sortedEvents = useMemo(() => 
  mapEvents.sort((a, b) => b.tier - a.tier),
  [mapEvents]
);
```

3. **Debounce RSS Polling**
```typescript
const debouncedPoll = useMemo(
  () => debounce(pollFeeds, 5000),
  []
);
```

### Backend Optimization

1. **Use Async/Await**
```rust
#[tauri::command]
pub async fn fetch_data() -> Result<Data, String> {
    // Async operations
}
```

2. **Cache RSS Results**
```rust
use std::sync::Mutex;
static CACHE: Mutex<HashMap<String, Vec<RSSItem>>> = Mutex::new(HashMap::new());
```

## Debugging

### Frontend Debugging

1. **Open DevTools**: Press F12 in the app
2. **Console Logs**: Check for errors
3. **React DevTools**: Install browser extension

### Backend Debugging

1. **Rust Logs**:
```rust
println!("Debug: {:?}", variable);
```

2. **Tauri Console**:
```bash
pnpm tauri dev
# Check terminal output
```

### Common Issues

**Issue: Ollama not responding**
- Check Ollama is running: `http://localhost:11434`
- Verify model is pulled: `ollama list`

**Issue: Map not rendering**
- Check browser console for errors
- Verify Maplibre GL CSS is imported

**Issue: RSS feeds not updating**
- Check network tab in DevTools
- Verify feed URLs are accessible

## Code Style

### TypeScript/React

- Use functional components with hooks
- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting

### Rust

- Follow Rust standard formatting (`cargo fmt`)
- Use `clippy` for linting (`cargo clippy`)
- Handle errors properly with `Result<T, E>`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Resources

- **Tauri Docs**: https://tauri.app/
- **React Docs**: https://react.dev/
- **Maplibre GL**: https://maplibre.org/
- **Ollama API**: https://github.com/ollama/ollama/blob/main/docs/api.md
- **Zustand**: https://github.com/pmndrs/zustand

---

**Happy coding! The Restrainer awaits your contributions.**
