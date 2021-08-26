param(
    [Parameter(Mandatory=$True, Position=0, ValueFromPipeline=$false)]
    [System.String]$BakupFolder
)

# Choose Environment
$IsDev = Read-Host "Is Dev? [y/n]"
while($IsDev -ne "y")
{
    if ($IsDev -eq 'n') {break}
    $IsDev = Read-Host "Is Dev? [y/n]"
}
$Env = if ($IsDev -eq "y") {"dev"} else {"prod"}

# Variables
$PicturesSourceCleanup = "./API/recipesPictures/$($Env)/*"
$PicturesSourceFolder = "./API/recipesPictures/$($Env)"
$DbContainer = "database_$($Env)"

# Unzip db
Expand-Archive $BakupFolder/db.zip ./DB/backupTemp
While (!(Test-Path ./DB/backupTemp/db.sql)) { Start-Sleep 2 }

# Restore db - Must pass by docker volume because of some encoding problem
docker exec -i $DbContainer sh -c 'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD" < /backup/db.sql'
Remove-Item -recurse ./DB/backupTemp/db.sql

# Restore (unzip) pictures
Remove-Item $PicturesSourceCleanup
Expand-Archive -LiteralPath $BakupFolder/pictures.zip -DestinationPath $PicturesSourceFolder

# Done
Write-Host ""
Write-Host "Backup '$($BakupFolder)' restored!"
Write-Host ""

pause