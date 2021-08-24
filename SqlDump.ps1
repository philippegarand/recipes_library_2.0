param(
    [Parameter(Mandatory=$True, Position=0, ValueFromPipeline=$false)]
    [System.String]$BackupOutupFolder
)

# Change to database_prod AND backup location
$BackupFolderName = "recipesLibraryBackup_$((Get-Date).ToString('yyyy-MM-dd_HH-mm'))"
$PicturesSource = "./API/recipesPictures/dev/*"
$DbContainer = "database_dev"

# Create new backup instance folder
New-Item -ItemType Directory -Path $BackupOutupFolder\$BackupFolderName | Out-Null

# Create dump file zip
docker exec $DbContainer sh -c 'exec mysqldump --all-databases -uroot -p"$MYSQL_ROOT_PASSWORD"' > $BackupOutupFolder\$BackupFolderName\db.sql
Compress-Archive -Path $BackupOutupFolder\$BackupFolderName\db.sql -DestinationPath $BackupOutupFolder\$BackupFolderName\db.zip
Remove-Item $BackupOutupFolder\$BackupFolderName\db.sql

# Zip recipes
Get-ChildItem -Path $PicturesSource | Compress-Archive -DestinationPath $BackupOutupFolder\$BackupFolderName\pictures.zip

Write-Host ""
Write-Host "Backup created at $($BackupOutupFolder)/$($BackupFolderName)"
Write-Host ""

pause