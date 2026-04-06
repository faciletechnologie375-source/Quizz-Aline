$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$webDir = Join-Path $root "www"

if (Test-Path $webDir) {
  Remove-Item -Recurse -Force $webDir
}

New-Item -ItemType Directory -Path $webDir | Out-Null

$filesToCopy = @(
  "index.html",
  "styles.css",
  "app.js",
  "data.js",
  "online-config.js",
  "favicon.svg",
  "logo.jpg"
)

foreach ($file in $filesToCopy) {
  $source = Join-Path $root $file
  if (Test-Path $source) {
    Copy-Item -Path $source -Destination $webDir -Force
  }
}

Write-Host "Web assets copied to $webDir"
