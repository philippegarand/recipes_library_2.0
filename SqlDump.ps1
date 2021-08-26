param(
    [Parameter(Mandatory=$True, Position=0, ValueFromPipeline=$false)]
    [System.String]$BackupOutupFolder
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
$PicturesSource = "./API/recipesPictures/$($Env)/*"
$DbContainer = "database_$($Env)"
$BackupFolderName = "recipesLibraryBackup_$((Get-Date).ToString('yyyy-MM-dd_HH-mm'))"

# Create new backup folder
New-Item -ItemType Directory -Path $BackupOutupFolder\$BackupFolderName | Out-Null

# Create dump file zip - Must pass by docker volume because of some encoding problem
docker exec $DbContainer sh -c 'exec mysqldump --all-databases -uroot -p"$MYSQL_ROOT_PASSWORD" -r /backup/db.sql'
Compress-Archive -Path .\DB\backupTemp\db.sql -DestinationPath $BackupOutupFolder\$BackupFolderName\db.zip
Remove-Item .\DB\backupTemp\db.sql

# Zip recipes
Get-ChildItem -Path $PicturesSource | Compress-Archive -DestinationPath $BackupOutupFolder\$BackupFolderName\pictures.zip

# Done
Write-Host ""
Write-Host "Backup created at $($BackupOutupFolder)/$($BackupFolderName)"
Write-Host ""

pause