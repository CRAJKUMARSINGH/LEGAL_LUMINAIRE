param(
  [switch]$All
)

$ErrorActionPreference = "Stop"

Write-Host "Legal Luminaire cleanup starting..."

function Remove-IfExists($path) {
  if (Test-Path $path) {
    Write-Host "Removing: $path"
    Remove-Item -Recurse -Force $path
  }
}

# Python caches
Get-ChildItem -Recurse -Directory -Filter "__pycache__" -ErrorAction SilentlyContinue |
  ForEach-Object { Remove-IfExists $_.FullName }
Get-ChildItem -Recurse -File -Include "*.pyc","*.pyo" -ErrorAction SilentlyContinue |
  ForEach-Object { Remove-Item -Force $_.FullName }
Remove-IfExists ".pytest_cache"

# TypeScript incremental caches
Get-ChildItem -Recurse -File -Filter "*.tsbuildinfo" -ErrorAction SilentlyContinue |
  ForEach-Object { Remove-Item -Force $_.FullName }

# Frontend build + cache
Remove-IfExists "artifacts/legal-luminaire/dist"
Remove-IfExists "artifacts/legal-luminaire/node_modules/.vite"
Remove-IfExists "artifacts/legal-luminaire/node_modules/.cache"

if ($All) {
  # WARNING: these are environment-specific and will be regenerated.
  Remove-IfExists "artifacts/legal-luminaire/backend/chroma_db"
  Remove-IfExists "artifacts/legal-luminaire/backend/uploaded_cases"
}

Write-Host "Cleanup complete."

