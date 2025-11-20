# Building Katechon Engine on Linux

## ⚠️ Important Note

**Katechon Engine is designed for Windows 11.** However, you can build and test it on Linux for development purposes.

## The Issue You're Experiencing

The error you're seeing:
```
The system library `glib-2.0` required by crate `glib-sys` was not found.
```

This happens because Tauri on Linux requires GTK and WebKit libraries that aren't installed by default.

## Solution 1: Install Linux Dependencies (For Development/Testing)

If you want to build on Linux for testing:

### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install -y \
    libwebkit2gtk-4.1-dev \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    libgtk-3-dev \
    libglib2.0-dev \
    libpango1.0-dev \
    libgdk-pixbuf2.0-dev \
    libcairo2-dev \
    libatk1.0-dev
```

### After installing dependencies:
```bash
pnpm tauri build
```

This will create a Linux binary, **not a Windows MSI installer**.

## Solution 2: Build on Windows 11 (Recommended)

To create the Windows MSI installer, you **must build on Windows 11**:

### Option A: Use a Windows 11 Machine

1. Clone the repo on Windows 11:
   ```powershell
   git clone https://github.com/cocobeach/katechon-engine.git
   cd katechon-engine
   ```

2. Install prerequisites:
   - Node.js 22+: https://nodejs.org/
   - Rust: https://rustup.rs/
   - pnpm: `npm install -g pnpm`

3. Build:
   ```powershell
   pnpm install
   pnpm tauri build
   ```

4. Find MSI at:
   ```
   src-tauri\target\release\bundle\msi\Katechon Engine_1.0.0_x64_en-US.msi
   ```

### Option B: Use WSL2 with Windows Cross-Compilation (Advanced)

This is complex and not recommended for beginners.

### Option C: Use GitHub Actions (Automated)

I can set up GitHub Actions to automatically build the Windows installer when you push code. However, GitHub's free tier has limitations.

## Solution 3: Use a Windows VM

If you only have Linux, use a Windows 11 VM:

1. **VirtualBox** or **VMware**
2. Install Windows 11 (you can use evaluation version)
3. Install build tools inside the VM
4. Build the MSI installer

## What You Can Do on Linux

On Linux, you can:
- ✅ Develop and test the application
- ✅ Run in development mode: `pnpm tauri dev`
- ✅ Build a Linux AppImage/deb package
- ❌ **Cannot** create Windows MSI installer

## Cross-Compilation (Not Recommended)

Tauri doesn't officially support cross-compiling from Linux to Windows. It's technically possible but extremely complex and error-prone.

## Recommended Workflow

1. **Develop on Linux** (if that's your main OS)
   ```bash
   # Install Linux dependencies first (see above)
   pnpm tauri dev
   ```

2. **Build Windows installer on Windows 11**
   - Use a Windows machine
   - Or use a Windows VM
   - Or use GitHub Actions

## Quick Fix for Your Current Situation

Since you're on Linux and getting these errors, you have two choices:

### Choice 1: Install Linux dependencies and build for Linux
```bash
sudo apt update
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file libssl-dev libayatana-appindicator3-dev librsvg2-dev libgtk-3-dev libglib2.0-dev libpango1.0-dev libgdk-pixbuf2.0-dev libcairo2-dev libatk1.0-dev

pnpm tauri build
```

This creates a **Linux binary**, not a Windows installer.

### Choice 2: Move to Windows 11 to build the MSI
Transfer the code to a Windows 11 machine and build there.

## Why This Limitation Exists

- **Tauri uses native OS APIs**: On Linux it uses GTK/WebKit, on Windows it uses WebView2
- **MSI installers are Windows-specific**: They can only be created on Windows
- **Code signing**: Windows executables should be signed on Windows

## Alternative: Docker with Wine (Not Recommended)

Theoretically possible but extremely complex and unreliable. Not worth the effort.

## Summary

| Platform | Can Build | Output |
|----------|-----------|--------|
| Windows 11 | ✅ Yes | Windows MSI installer |
| Linux | ✅ Yes | Linux AppImage/deb |
| macOS | ✅ Yes | macOS DMG/app |
| Linux → Windows | ❌ No | Not supported |

## Need Help?

If you need the Windows MSI installer and only have Linux:
1. Use a Windows 11 VM (easiest)
2. Ask someone with Windows to build it
3. Use a cloud Windows instance (Azure, AWS)
4. Set up GitHub Actions (I can help with this)

---

**Bottom line: To create the Windows MSI installer, you need to build on Windows 11.**
