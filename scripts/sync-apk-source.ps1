# Run from the original repository, not from C:\SMDBuild.
$ErrorActionPreference = 'Stop'
$sourceRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$buildRoot = 'C:\SMDBuild'

if ($sourceRoot.TrimEnd('\') -eq $buildRoot) {
    throw 'Run this script from the original repository, not the build copy.'
}
if (-not (Test-Path -LiteralPath (Join-Path $sourceRoot 'package.json'))) {
    throw 'The source repository does not contain package.json.'
}

New-Item -ItemType Directory -Path $buildRoot -Force | Out-Null
if ((Get-Item -LiteralPath $buildRoot).Attributes -band [System.IO.FileAttributes]::ReparsePoint) {
    throw 'The build directory must not be a junction or symbolic link.'
}
$oldSource = [System.IO.Path]::GetFullPath((Join-Path $buildRoot 'src'))
$backupRoot = [System.IO.Path]::GetFullPath((Join-Path $buildRoot '.source-backups'))
$backupPath = Join-Path $backupRoot ('src-' + (Get-Date -Format 'yyyyMMdd-HHmmss-ffff'))

# Validate exact targets before moving an existing source tree.
foreach ($target in @($oldSource, $backupRoot, $backupPath)) {
    if (-not $target.StartsWith($buildRoot + '\', [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Unsafe build target: $target"
    }
}
if (Test-Path -LiteralPath $oldSource) {
    if ((Get-Item -LiteralPath $oldSource).Attributes -band [System.IO.FileAttributes]::ReparsePoint) {
        throw 'The build src directory must not be a junction or symbolic link.'
    }
    if ((Test-Path -LiteralPath $backupRoot) -and
        ((Get-Item -LiteralPath $backupRoot).Attributes -band [System.IO.FileAttributes]::ReparsePoint)) {
        throw 'The backup directory must not be a junction or symbolic link.'
    }
    New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null
    Move-Item -LiteralPath $oldSource -Destination $backupPath
    Write-Host "Previous build source preserved at $backupPath"
}

# Copy into a fresh src directory, so deleted routes cannot survive an /E copy.
& robocopy $sourceRoot $buildRoot /E /R:2 /W:1 /NP /NFL /NDL /XD .git node_modules android ios .expo dist web-build .source-backups
if ($LASTEXITCODE -ge 8) {
    throw "Source copy failed with robocopy exit code $LASTEXITCODE."
}
Write-Host 'Build source synchronized. Continue with npm ci and clean Expo prebuild.'
exit 0
