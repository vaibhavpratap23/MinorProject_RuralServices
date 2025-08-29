Write-Host "Starting GigFinder services with automatic port handling..."

$ErrorActionPreference = 'Stop'

function Ensure-Maven {
  try { & mvn -v | Out-Null; return "mvn" } catch {
    $tools = Join-Path $PSScriptRoot "tools"
    $existing = Get-ChildItem $tools -Directory -Filter "apache-maven-*" -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $existing) { throw "Maven not found. Run setup-laptop.ps1 or install Maven." }
    return (Join-Path $existing.FullName "bin\mvn.cmd")
  }
}

function Get-FreePort {
  param([int]$preferred)
  try {
    $listener = [System.Net.Sockets.TcpListener]::new('127.0.0.1', $preferred)
    $listener.Start(); $listener.Stop(); return $preferred
  } catch {
    $tcp = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback,0)
    $tcp.Start(); $port = ($tcp.LocalEndpoint).Port; $tcp.Stop(); return $port
  }
}

function Kill-ProcessOnPort {
  param([int]$port)
  $conns = netstat -ano | Select-String ":$port\s" | ForEach-Object { ($_ -split "\s+")[-1] } | Sort-Object -Unique
  foreach ($pid in $conns) { if ($pid -and $pid -ne '0') { Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue } }
}

$BACKEND_PORT = Get-FreePort -preferred 8081
Kill-ProcessOnPort -port $BACKEND_PORT
$FRONTEND_PORT = Get-FreePort -preferred 5173
$ADMIN_PORT = Get-FreePort -preferred 5174

$env:BACKEND_URL = "http://localhost:$BACKEND_PORT"
$env:PORT = $FRONTEND_PORT
$env:ADMIN_PORT = $ADMIN_PORT

Write-Host "Backend on $BACKEND_PORT | Frontend on $FRONTEND_PORT | Admin on $ADMIN_PORT"

$mvn = Ensure-Maven

# Start backend (respect profile and port)
Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command \"cd '$PSScriptRoot'; & '$mvn' -q -DskipTests -Dspring-boot.run.profiles=postgres -Dserver.port=$BACKEND_PORT spring-boot:run\"" | Out-Null

Start-Sleep -Seconds 5

# Start frontend
Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command \"cd '$PSScriptRoot/frontend'; $env:PORT=$FRONTEND_PORT; $env:BACKEND_URL='$env:BACKEND_URL'; npm install --no-progress --legacy-peer-deps --quiet; npm run dev -- --port $FRONTEND_PORT\"" | Out-Null

# Start admin if present
if (Test-Path "$PSScriptRoot/admin/package.json") {
  Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command \"cd '$PSScriptRoot/admin'; $env:ADMIN_PORT=$ADMIN_PORT; $env:BACKEND_URL='$env:BACKEND_URL'; npm install --no-progress --legacy-peer-deps --quiet; npm run dev -- --port $ADMIN_PORT\"" | Out-Null
}

Start-Sleep -Seconds 3
Start-Process "http://localhost:$FRONTEND_PORT"
Start-Process "$env:BACKEND_URL/h2-console"
Write-Host "All services starting. Close spawned terminals to stop." -ForegroundColor Green


