$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

function New-Icon([int]$size, [string]$out, [int]$pad) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.Color]::FromArgb(255, 255, 77, 0))
  $inner = $size - (2 * $pad)
  $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 247, 240))
  $left = [single]($pad + $inner * 0.18)
  $top = [single]($pad + $inner * 0.12)
  $w = [single]($inner * 0.64)
  $h = [single]($inner * 0.64)
  $g.FillEllipse($brush, $left, $top, $w, $h)
  $fontSize = [single]($size * 0.18)
  $font = New-Object System.Drawing.Font "Georgia", $fontSize, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = [System.Drawing.StringAlignment]::Center
  $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
  $textBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
  $textRect = New-Object System.Drawing.RectangleF 0, ([single]($size * 0.62)), $size, ([single]($size * 0.32))
  $g.DrawString("MK", $font, $textBrush, $textRect, $sf)
  $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  $font.Dispose()
  $brush.Dispose()
  $textBrush.Dispose()
  Write-Output "wrote $out"
}

$dir = "C:\Users\cacha\Projects\mamas-kitchen\assets\icons"
New-Icon 192 (Join-Path $dir "icon-192.png") 0
New-Icon 512 (Join-Path $dir "icon-512.png") 0
New-Icon 512 (Join-Path $dir "icon-maskable-512.png") 48
