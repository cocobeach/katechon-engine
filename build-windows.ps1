# Katechon Engine - Windows Build Script
# Run this script in PowerShell to build the Windows installer

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Katechon Engine - Windows Build" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if pnpm is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $pnpmVersion = pnpm --version
    Write-Host "✓ pnpm installed: $pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ pnpm not found. Installing..." -ForegroundColor Red
    npm install -g pnpm
}

# Check if Rust is installed
try {
    $rustVersion = rustc --version
    Write-Host "✓ Rust installed: $rustVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Rust not found. Please install from https://rustup.rs/" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pnpm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Building application..." -ForegroundColor Yellow
pnpm tauri build

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Installer location:" -ForegroundColor Cyan
Write-Host "src-tauri\target\release\bundle\msi\" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Navigate to the installer directory" -ForegroundColor White
Write-Host "2. Double-click the .msi file to install" -ForegroundColor White
Write-Host "3. Make sure Ollama is installed and running" -ForegroundColor White
Write-Host ""
