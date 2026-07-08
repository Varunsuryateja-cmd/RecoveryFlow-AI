<#
.SYNOPSIS
    RecoveryFlow AI — Single-command application launcher (Windows PowerShell)

.DESCRIPTION
    Starts both the FastAPI backend (uvicorn on port 8000) and the React
    Vite dev server (port 5173) concurrently. Press Ctrl+C to stop both.

.USAGE
    .\run.ps1
#>

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$BackendDir  = Join-Path $ProjectRoot "backend"
$FrontendDir = Join-Path $ProjectRoot "frontend"
$VenvPython  = Join-Path $BackendDir "venv\Scripts\python.exe"
$VenvUvicorn = Join-Path $BackendDir "venv\Scripts\uvicorn.exe"

# ── Colour helpers ──────────────────────────────────────────────────────────
function Write-Header($msg) { Write-Host "`n🏟  $msg" -ForegroundColor Cyan }
function Write-Step($msg)   { Write-Host "   » $msg" -ForegroundColor Gray }
function Write-OK($msg)     { Write-Host "   ✔ $msg" -ForegroundColor Green }
function Write-Warn($msg)   { Write-Host "   ⚠ $msg" -ForegroundColor Yellow }

Write-Header "RecoveryFlow AI — Application Launcher"
Write-Host   "   FIFA World Cup 2026 Smart Stadium Exit Planner" -ForegroundColor DarkCyan
Write-Host ""

# ── 1. Backend: create venv if missing ─────────────────────────────────────
Write-Header "Backend Setup"
if (-not (Test-Path $VenvPython)) {
    Write-Step "Creating Python virtual environment..."
    python -m venv "$BackendDir\venv"
    Write-OK "Virtual environment created."
} else {
    Write-OK "Virtual environment already exists."
}

# ── 2. Backend: install dependencies ──────────────────────────────────────
Write-Step "Installing Python dependencies..."
& "$BackendDir\venv\Scripts\pip.exe" install -r "$BackendDir\requirements.txt" --quiet
Write-OK "Python dependencies installed."

# ── 3. Frontend: install npm packages if node_modules is missing ───────────
Write-Header "Frontend Setup"
$NodeModules = Join-Path $FrontendDir "node_modules"
if (-not (Test-Path $NodeModules)) {
    Write-Step "Installing npm packages..."
    Push-Location $FrontendDir
    npm install --silent
    Pop-Location
    Write-OK "npm packages installed."
} else {
    Write-OK "node_modules already present."
}

# ── 4. Launch both servers ─────────────────────────────────────────────────
Write-Header "Starting Servers"
Write-Host ""
Write-Host "   ┌─────────────────────────────────────────────────────┐" -ForegroundColor DarkCyan
Write-Host "   │  FastAPI Backend  ➜  http://127.0.0.1:8000          │" -ForegroundColor DarkCyan
Write-Host "   │  OpenAPI Docs     ➜  http://127.0.0.1:8000/docs     │" -ForegroundColor DarkCyan
Write-Host "   │  React Frontend   ➜  http://localhost:5173           │" -ForegroundColor DarkCyan
Write-Host "   │                                                       │" -ForegroundColor DarkCyan
Write-Host "   │  Press Ctrl+C to stop both servers                    │" -ForegroundColor DarkCyan
Write-Host "   └─────────────────────────────────────────────────────┘" -ForegroundColor DarkCyan
Write-Host ""

# Start backend in a background job
$backendJob = Start-Job -Name "RecoveryFlow-Backend" -ScriptBlock {
    param($uvicorn, $backendDir)
    Set-Location $backendDir
    & $uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
} -ArgumentList $VenvUvicorn, $BackendDir

# Start frontend in a background job
$frontendJob = Start-Job -Name "RecoveryFlow-Frontend" -ScriptBlock {
    param($frontendDir)
    Set-Location $frontendDir
    npm run dev
} -ArgumentList $FrontendDir

Write-Step "Backend job started  (ID: $($backendJob.Id))"
Write-Step "Frontend job started (ID: $($frontendJob.Id))"
Write-Host ""

# ── 5. Stream output from both jobs until Ctrl+C ──────────────────────────
try {
    while ($true) {
        # Print backend output
        $backendOutput = Receive-Job -Job $backendJob -ErrorAction SilentlyContinue
        if ($backendOutput) {
            $backendOutput | ForEach-Object { Write-Host "[backend]  $_" -ForegroundColor DarkGreen }
        }

        # Print frontend output
        $frontendOutput = Receive-Job -Job $frontendJob -ErrorAction SilentlyContinue
        if ($frontendOutput) {
            $frontendOutput | ForEach-Object { Write-Host "[frontend] $_" -ForegroundColor DarkCyan }
        }

        # Check for job failures
        if ($backendJob.State -eq 'Failed') {
            Write-Warn "Backend job exited unexpectedly. Check the log above."
            break
        }
        if ($frontendJob.State -eq 'Failed') {
            Write-Warn "Frontend job exited unexpectedly. Check the log above."
            break
        }

        Start-Sleep -Milliseconds 500
    }
}
finally {
    # Graceful shutdown on Ctrl+C or failure
    Write-Host ""
    Write-Host "   Stopping servers..." -ForegroundColor Yellow
    Stop-Job  $backendJob,  $frontendJob  -ErrorAction SilentlyContinue
    Remove-Job $backendJob, $frontendJob  -Force -ErrorAction SilentlyContinue
    Write-Host "   Both servers stopped. Goodbye!" -ForegroundColor Cyan
}
