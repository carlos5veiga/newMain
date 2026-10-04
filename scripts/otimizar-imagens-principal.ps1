# Run from the project root: powershell -File scripts/otimizar-imagens-principal.ps1
# Create small delivery copies; originals used by other pages are preserved.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$taskRoot = Split-Path $PSScriptRoot -Parent
$taskOutput = Join-Path $taskRoot 'img/principal'
New-Item -ItemType Directory -Path $taskOutput -Force | Out-Null
$taskSources = @(
    @('img/LogoTuts40.png', 'logo.png', 40),
    @('img/CapaSolfejosParaPraticar.png', 'solfejos.jpg', 115),
    @('img/CapaMetronomo.jpg', 'metronomo.jpg', 115),
    @('img/CapaMetronomoFa.jpg', 'metronomo-fa.jpg', 115),
    @('divulgacao/livros/img/capa.jpg', 'livro.jpg', 480),
    @('img/imagem scoreplay.jpg', 'scoreplay.jpg', 360),
    @('img/imagem teoria.jpg', 'teoria.jpg', 360),
    @('img/imagem intervalos.jpg', 'intervalos.jpg', 360),
    @('img/imagem melodias.jpg', 'melodias.jpg', 360),
    @('img/imagem finale.jpg', 'finale.jpg', 360),
    @('img/ars600.png', 'arscantandi.jpg', 600),
    @('img/novoscantos600.jpg', 'novoscantos.jpg', 600),
    @('img/penta600.jpg', 'pentagono.jpg', 600)
)
$taskCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
foreach ($taskSource in $taskSources) {
    $taskInput = Join-Path $taskRoot $taskSource[0]
    $taskImage = [System.Drawing.Image]::FromFile($taskInput)
    $taskWidth = [Math]::Min([int]$taskSource[2], $taskImage.Width)
    $taskHeight = [int][Math]::Round($taskImage.Height * $taskWidth / $taskImage.Width)
    $taskBitmap = New-Object System.Drawing.Bitmap($taskWidth, $taskHeight)
    $taskGraphics = [System.Drawing.Graphics]::FromImage($taskBitmap)
    $taskGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $taskGraphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $taskGraphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $taskGraphics.DrawImage($taskImage, 0, 0, $taskWidth, $taskHeight)
    $taskDestination = Join-Path $taskOutput $taskSource[1]
    if ($taskSource[1].EndsWith('.png')) {
        $taskBitmap.Save($taskDestination, [System.Drawing.Imaging.ImageFormat]::Png)
    } else {
        $taskParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $taskParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]82)
        $taskBitmap.Save($taskDestination, $taskCodec, $taskParams)
        $taskParams.Dispose()
    }
    $taskGraphics.Dispose()
    $taskBitmap.Dispose()
    $taskImage.Dispose()
    [PSCustomObject]@{File=$taskSource[1];Bytes=(Get-Item -LiteralPath $taskDestination).Length;Width=$taskWidth;Height=$taskHeight}
}
