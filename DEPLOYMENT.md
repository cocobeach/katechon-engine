# Deployment Guide - Katechon Engine

## Overview

This guide explains how to deploy the Katechon Engine application on Windows 11 systems.

## Build Process

### Prerequisites on Build Machine

1. **Windows 11** (or Windows 10 with latest updates)
2. **Node.js 22+** - https://nodejs.org/
3. **Rust** - https://rustup.rs/
4. **pnpm** - `npm install -g pnpm`
5. **Git** - https://git-scm.com/

### Building the Installer

#### Option 1: Using PowerShell Script (Recommended)

```powershell
# Open PowerShell in project directory
.\build-windows.ps1
```

#### Option 2: Manual Build

```powershell
# Install dependencies
pnpm install

# Build for production
pnpm tauri build
```

### Build Output

After successful build, you'll find:

```
src-tauri/target/release/bundle/msi/
├── Katechon Engine_1.0.0_x64_en-US.msi    # Main installer
└── Katechon Engine_1.0.0_x64_en-US.msi.zip # Compressed installer
```

## Distribution

### File Checklist

Distribute the following files:

1. **Installer**: `Katechon Engine_1.0.0_x64_en-US.msi`
2. **Documentation**:
   - `README.md` - Main documentation
   - `WINDOWS_INSTALL.md` - Windows installation guide
   - `DEVELOPER_GUIDE.md` - Developer documentation
3. **License**: `LICENSE` (if applicable)

### Recommended Distribution Methods

1. **GitHub Releases**
   - Create a new release
   - Upload the MSI installer
   - Include README and installation guide
   - Tag with version number (e.g., v1.0.0)

2. **Direct Download**
   - Host on your website
   - Provide checksums (SHA256)
   - Include installation instructions

3. **Package Manager** (Future)
   - Chocolatey
   - Winget
   - Scoop

## Installation on Target System

### End User Requirements

1. **Windows 11** (or Windows 10 version 1903+)
2. **Ollama** - Must be installed separately
3. **8GB RAM minimum** (16GB recommended)
4. **10GB free disk space**
5. **Internet connection** (for RSS feeds)

### Installation Steps

1. **Install Ollama First**
   ```powershell
   # Download from https://ollama.ai
   # Install and pull a model
   ollama pull llama2
   ```

2. **Install Katechon Engine**
   - Double-click the MSI installer
   - Follow installation wizard
   - Launch from Start Menu

3. **First Launch Configuration**
   - Open Settings (⚙️ icon)
   - Verify Ollama URL: `http://127.0.0.1:11434`
   - Set model name: `llama2` (or your preferred model)
   - Save settings

## Configuration

### Default Settings

```json
{
  "ollamaUrl": "http://127.0.0.1:11434",
  "ollamaModel": "llama2",
  "stripePublicKey": ""
}
```

### Environment Variables (Optional)

For enterprise deployments, you can pre-configure:

```powershell
# Set default Ollama URL
$env:KATECHON_OLLAMA_URL = "http://custom-ollama-server:11434"

# Set default model
$env:KATECHON_OLLAMA_MODEL = "llama3"
```

## Security Considerations

### Code Signing (Recommended for Production)

1. **Obtain Code Signing Certificate**
   - Purchase from trusted CA (DigiCert, Sectigo, etc.)
   - Or use self-signed for internal deployment

2. **Sign the MSI**
   ```powershell
   signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com "Katechon Engine_1.0.0_x64_en-US.msi"
   ```

3. **Verify Signature**
   ```powershell
   signtool verify /pa "Katechon Engine_1.0.0_x64_en-US.msi"
   ```

### Windows SmartScreen

- Unsigned applications will trigger SmartScreen warnings
- Users must click "More info" → "Run anyway"
- Code signing eliminates this warning

### Firewall Rules

The application needs internet access for:
- RSS feed fetching
- Future updates (optional)

Default Windows Firewall should allow this automatically.

## Enterprise Deployment

### Silent Installation

```powershell
# Install silently
msiexec /i "Katechon Engine_1.0.0_x64_en-US.msi" /quiet /qn

# Install with log
msiexec /i "Katechon Engine_1.0.0_x64_en-US.msi" /quiet /qn /l*v install.log
```

### Group Policy Deployment

1. Copy MSI to network share
2. Create GPO for software installation
3. Assign to target computers/users
4. Deploy on next restart

### Configuration Management

Pre-configure settings via registry:

```powershell
# Set default Ollama URL
New-ItemProperty -Path "HKLM:\SOFTWARE\Katechon\Engine" -Name "OllamaURL" -Value "http://127.0.0.1:11434" -PropertyType String

# Set default model
New-ItemProperty -Path "HKLM:\SOFTWARE\Katechon\Engine" -Name "OllamaModel" -Value "llama2" -PropertyType String
```

## Updates

### Manual Updates

1. Build new version with updated version number
2. Distribute new MSI
3. Users install over existing version
4. Settings are preserved

### Automatic Updates (Future Feature)

Tauri supports automatic updates via:
- GitHub Releases
- Custom update server
- Configuration in `tauri.conf.json`

## Monitoring

### Application Logs

Logs are stored in:
```
C:\Users\<username>\AppData\Roaming\com.katechon.engine\logs\
```

### Error Reporting

For production deployments, consider:
- Sentry integration
- Custom error logging
- User feedback system

## Troubleshooting Deployment Issues

### Issue: MSI won't install

**Solutions:**
- Run as Administrator
- Check Windows Installer service is running
- Verify disk space
- Check Windows Event Viewer

### Issue: Application won't start after install

**Solutions:**
- Verify .NET Framework is installed
- Check application logs
- Reinstall Visual C++ Redistributables
- Run as Administrator

### Issue: Ollama connection fails

**Solutions:**
- Verify Ollama is installed and running
- Check firewall settings
- Verify Ollama URL in settings
- Test Ollama directly: `http://localhost:11434`

## Rollback

### Uninstall

```powershell
# Silent uninstall
msiexec /x "Katechon Engine_1.0.0_x64_en-US.msi" /quiet /qn

# Or via Windows Settings
# Settings > Apps > Installed apps > Katechon Engine > Uninstall
```

### Preserve User Data

User settings are stored in:
```
C:\Users\<username>\AppData\Roaming\com.katechon.engine\
```

Backup this folder before uninstall to preserve:
- Settings
- Chat history
- Custom RSS feeds

## Performance Tuning

### Recommended Ollama Models by System

**8GB RAM Systems:**
- llama2 (4GB)
- mistral (4GB)
- phi3 (2GB)

**16GB+ RAM Systems:**
- llama3 (7GB)
- mixtral (26GB - requires 32GB RAM)

### Network Optimization

For enterprise deployments with many users:
- Cache RSS feeds centrally
- Use local Ollama server
- Implement rate limiting

## Compliance

### Data Privacy

- All AI processing is local (via Ollama)
- No data sent to external servers (except RSS fetching)
- GDPR compliant (no user tracking)

### Open Source Licenses

Ensure compliance with:
- Tauri (MIT/Apache 2.0)
- React (MIT)
- Maplibre GL (BSD)
- Other dependencies (check package.json)

## Support

### User Support

Provide users with:
- README.md
- WINDOWS_INSTALL.md
- Troubleshooting guide
- Contact information

### Developer Support

For customization and development:
- DEVELOPER_GUIDE.md
- Source code access
- API documentation

## Checklist

Before deploying to production:

- [ ] Application builds successfully
- [ ] MSI installer tested on clean Windows 11
- [ ] Ollama integration verified
- [ ] All features tested
- [ ] Documentation complete
- [ ] Code signed (if applicable)
- [ ] Antivirus false positives checked
- [ ] Performance tested with target hardware
- [ ] Uninstall tested
- [ ] Update process tested
- [ ] User feedback collected
- [ ] Support channels established

---

**Deployment complete. The Restrainer is ready for investigation.**
