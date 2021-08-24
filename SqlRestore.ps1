param(
    [Parameter(Mandatory=$True, Position=0, ValueFromPipeline=$false)]
    [System.String]$BakupFolder
)

# Change to database_prod AND backup location
$PicturesSourceCleanup = "./API/recipesPictures/dev/*"
$PicturesSourceFolder = "./API/recipesPictures/dev"
$DbContainer = "database_dev"

# Unzip db
Expand-Archive $BakupFolder/db.zip $BakupFolder/temp
While (!(Test-Path $BakupFolder/temp)) { Start-Sleep 2 }

# Restore db
Get-Content $BakupFolder/temp/db.sql | docker exec -i $DbContainer sh -c 'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD"'
Remove-Item -recurse $BakupFolder/temp

# Restore (unzip) pictures
Remove-Item $PicturesSourceCleanup
Expand-Archive -LiteralPath $BakupFolder/pictures.zip -DestinationPath $PicturesSourceFolder

Write-Host ""
Write-Host "Backup '$($BakupFolder)' restored!"
Write-Host ""

pause