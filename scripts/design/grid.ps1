param([string]$A, [string]$B, [int]$Cell = 160)
# Prints the overall diff and the worst grid cells between two screenshots (A = Stitch, B = app).
$S = Split-Path -Parent $MyInvocation.MyCommand.Path
$Tmp = Join-Path $env:TEMP "design-grid.png"
. "$S\compare.ps1" -A $A -B $B -X 0 -Y 0 -W 4 -H 4 -Out $Tmp | Out-Null
Add-Type -AssemblyName System.Drawing
$ia = [System.Drawing.Image]::FromFile($A); $w = $ia.Width; $h = $ia.Height; $ia.Dispose()
$ib = [System.Drawing.Image]::FromFile($B); $h = [Math]::Min($h, $ib.Height); $ib.Dispose()
$overall = [PixelCompare]::Compose($A, $B, (New-Object System.Drawing.Rectangle 0, 0, $w, $h), $Tmp, 1)
$cells = @()
for ($y = 0; $y -lt $h; $y += $Cell) {
  for ($x = 0; $x -lt $w; $x += $Cell * 2) {
    $r = [PixelCompare]::Compose($A, $B, (New-Object System.Drawing.Rectangle $x, $y, ($Cell * 2), $Cell), $Tmp, 1)
    $cells += [pscustomobject]@{ x = $x; y = $y; r = $r }
  }
}
$worst = $cells | Sort-Object r -Descending | Select-Object -First 4 | ForEach-Object { "({0},{1}) {2:P1}" -f $_.x, $_.y, $_.r }
"overall {0:P2} | worst: {1}" -f $overall, ($worst -join "  ")
