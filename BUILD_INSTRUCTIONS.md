# Build Instructions for Windows 11

## Prerequisites

Before building the Katechon Engine, ensure you have the following installed on your Windows 11 machine:

### 1. Node.js 22+
- Download: https://nodejs.org/
- Install the LTS version
- Verify: `node --version`

### 2. pnpm
```powershell
npm install -g pnpm
```
- Verify: `pnpm --version`

### 3. Rust
- Download: https://rustup.rs/
- Run the installer and follow the prompts
- Restart your terminal after installation
- Verify: `rustc --version` and `cargo --version`

### 4. Git for Windows
- Download: https://git-scm.com/download/win
- Install with default options
- Verify: `git --version`

### 5. Ollama (Required for running the app)
- Download: https://ollama.ai/download/windows
- Install and run
- Pull a model: `ollama pull llama2`

## Building the Application

### Step 1: Clone the Repository

```powershell
git clone https://github.com/cocobeach/katechon-engine.git
cd katechon-engine
```

### Step 2: Install Dependencies

```powershell
pnpm install
```

This will install all Node.js dependencies and Rust crates.

### Step 3: Build for Production

```powershell
pnpm tauri build
```

This process will:
1. Build the React frontend with Vite
2. Compile the Rust backend
3. Create the Windows MSI installer
4. Bundle everything together

**Build time:** 5-15 minutes depending on your system

### Step 4: Locate the Installer

After successful build, find the MSI installer at:

```
src-tauri\target\release\bundle\msi\Katechon Engine_1.0.0_x64_en-US.msi
```

## Alternative: Development Mode

To run the app in development mode (with hot reload):

```powershell
pnpm tauri dev
```

This will:
- Start the Vite dev server
- Launch the Tauri window
- Enable hot module replacement
- Show console logs

## Build Script (Automated)

Alternatively, use the provided PowerShell script:

```powershell
.\build-windows.ps1
```

This script will:
- Check prerequisites
- Install dependencies
- Build the application
- Show the installer location

## Troubleshooting

### Issue: "rustc not found"

**Solution:**
```powershell
# Restart your terminal or run:
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

### Issue: "pnpm not found"

**Solution:**
```powershell
npm install -g pnpm
# Restart terminal
```

### Issue: Build fails with "linker error"

**Solution:**
- Install Visual Studio Build Tools
- Download: https://visualstudio.microsoft.com/downloads/
- Select "Desktop development with C++"

### Issue: "WebView2 not found"

**Solution:**
- Windows 11 includes WebView2 by default
- If missing, download: https://developer.microsoft.com/en-us/microsoft-edge/webview2/

### Issue: Out of memory during build

**Solution:**
- Close other applications
- Increase virtual memory
- Use a machine with at least 8GB RAM

## Build Output

The build process creates:

```
src-tauri/target/release/
├── bundle/
│   └── msi/
│       ├── Katechon Engine_1.0.0_x64_en-US.msi  (Main installer)
│       └── Katechon Engine_1.0.0_x64_en-US.msi.zip
└── katechon-engine.exe  (Standalone executable)
```

## Installing the Built Application

1. Navigate to the MSI file location
2. Double-click `Katechon Engine_1.0.0_x64_en-US.msi`
3. Follow the installation wizard
4. Launch from Start Menu

## Customizing the Build

### Change App Version

Edit `src-tauri/tauri.conf.json`:
```json
{
  "version": "1.0.0"
}
```

### Change App Name

Edit `src-tauri/tauri.conf.json`:
```json
{
  "productName": "Katechon Engine"
}
```

### Change Window Size

Edit `src-tauri/tauri.conf.json`:
```json
{
  "app": {
    "windows": [{
      "width": 1600,
      "height": 1000
    }]
  }
}
```

## Code Signing (Optional)

For production releases, sign the MSI:

```powershell
# Requires a code signing certificate
signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com "Katechon Engine_1.0.0_x64_en-US.msi"
```

## Clean Build

To start fresh:

```powershell
# Remove node_modules
Remove-Item -Recurse -Force node_modules

# Remove Rust build artifacts
Remove-Item -Recurse -Force src-tauri\target

# Reinstall and rebuild
pnpm install
pnpm tauri build
```

## Build Performance Tips

1. **Use SSD**: Build on an SSD for faster compilation
2. **Close Apps**: Close unnecessary applications during build
3. **Antivirus**: Temporarily disable antivirus (can slow Rust compilation)
4. **Incremental Builds**: Use `pnpm tauri dev` for faster iteration

## Next Steps

After building:
1. Test the installer on a clean Windows 11 VM
2. Verify all features work
3. Check antivirus false positives
4. Consider code signing for production
5. Create GitHub release with the MSI

## Support

For build issues:
- Check the main README.md
- Review DEVELOPER_GUIDE.md
- Open an issue on GitHub: https://github.com/cocobeach/katechon-engine/issues

---

**Happy building! The Restrainer awaits compilation.**
