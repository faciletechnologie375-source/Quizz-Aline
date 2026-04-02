param(
  [string]$KeystorePath = "android-release.keystore",
  [string]$Alias = "capquiz",
  [string]$StorePassword = "changeit123",
  [string]$KeyPassword = "changeit123",
  [string]$ValidityDays = "10000"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command keytool -ErrorAction SilentlyContinue)) {
  throw "keytool est introuvable. Installe un JDK puis relance la commande."
}

if (Test-Path $KeystorePath) {
  Write-Host "Keystore deja present: $KeystorePath"
  exit 0
}

keytool -genkeypair `
  -v `
  -keystore $KeystorePath `
  -alias $Alias `
  -keyalg RSA `
  -keysize 2048 `
  -validity $ValidityDays `
  -storepass $StorePassword `
  -keypass $KeyPassword `
  -dname "CN=Cap sur le Quiz, OU=Mobile, O=CapQuiz, L=Kinshasa, S=Kinshasa, C=CD"

Write-Host "Keystore cree: $KeystorePath"
Write-Host "Copie keystore.properties.example vers keystore.properties et remplace les mots de passe."
