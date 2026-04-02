$ErrorActionPreference = "Continue"

Write-Host "=== Mobile Doctor ==="
Write-Host "Projet: Cap sur le Quiz"
Write-Host ""

$java = Get-Command java -ErrorAction SilentlyContinue
$keytool = Get-Command keytool -ErrorAction SilentlyContinue
$androidStudio = Test-Path "C:\Program Files\Android\Android Studio"
$androidSdk = $env:ANDROID_HOME -or $env:ANDROID_SDK_ROOT

Write-Host "Java dans PATH: $([bool]$java)"
if ($java) {
  Write-Host "  -> $($java.Source)"
}

Write-Host "keytool disponible: $([bool]$keytool)"
if ($keytool) {
  Write-Host "  -> $($keytool.Source)"
}

Write-Host "Android Studio installe: $androidStudio"
Write-Host "ANDROID_HOME/ANDROID_SDK_ROOT defini: $([bool]$androidSdk)"
if ($androidSdk) {
  Write-Host "  -> $($env:ANDROID_HOME)$($env:ANDROID_SDK_ROOT)"
}

Write-Host ""
if (-not $java) {
  Write-Host "Action requise: installer un JDK et definir JAVA_HOME."
}
if (-not $androidStudio) {
  Write-Host "Action requise: installer Android Studio."
}
if (-not $androidSdk) {
  Write-Host "Action recommandee: definir ANDROID_HOME ou ANDROID_SDK_ROOT."
}
