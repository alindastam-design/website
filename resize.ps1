$magick = "C:\Program Files (x86)\ImageMagick-7.1.2-Q16-HDRI\magick.exe"
$dir = "C:\Users\MeesGoetheer\Claude_files\Portfolio\public\images"

$images = @(
    "METZNALLEN_LOWRES_JANTINATALSMA103.jpg",
    "METZNALLEN_LOWRES_JANTINATALSMA62.jpg",
    "METZNALLEN_LOWRES_JANTINATALSMA28.jpg",
    "METZNALLEN_LOWRES_JANTINATALSMA77.jpg",
    "gwen-analog.jpg",
    "gwen-img.jpg",
    "gwen-scheltema-1.jpg",
    "gwen-scheltema-2.jpg",
    "gwen-recent.png",
    "GSTAR_ANATOMICDENIM_SOPHIEVANVEEN_FULL_074.jpg",
    "GSTAR_ANATOMICDENIM_SOPHIEVANVEEN_FULL_119.jpg",
    "G-StarAnatomicDenimeventAmsterdamAFW-228 kopie.jpg",
    "G-StarAnatomicDenimeventAmsterdamAFW-269 kopie.jpg",
    "G-star_75.jpg",
    "_U9A3870_..jpg",
    "_U9A3905_..jpg",
    "_U9A3954_..jpg",
    "_U9A4225_..jpg"
)

foreach ($img in $images) {
    $path = Join-Path $dir $img
    if (Test-Path $path) {
        & $magick $path -resize "1920x1080^" -gravity Center -extent "1920x1080" -quality 90 $path
        Write-Host "OK: $img"
    } else {
        Write-Host "NIET GEVONDEN: $img"
    }
}

Write-Host "`nKlaar!"
