using API.Helpers.Interfaces;
using System.Management.Automation;
using System.Threading.Tasks;

namespace API.Helpers
{
    /// <PowerShell>
    /// https://www.codeproject.com/Questions/1206308/Powershell-commands-from-Csharp
    /// dump => docker exec database_prod sh -c 'exec mysqldump --all-databases -uroot -p"$MYSQL_ROOT_PASSWORD"' > D:\zzz_test\backup.sql
    /// restore => Get-Content D:\zzz_test\backup.sql | docker exec -i database_prod sh -c 'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD"'
    /// </PowerShell>
    public class BackupHelper : IBackupHelper
    {       
        private string _dbName;
        private string _dbPass;

        public BackupHelper(string dbName, string dbPass)
        {
            this._dbName = dbName;
            this._dbPass = dbPass;
        }

        public async Task Dump(string backupOutputPath)
        {
            if (string.IsNullOrEmpty(this._dbName)) return;

            using PowerShell shell = PowerShell.Create();

            shell.AddScript($"docker exec $DB_NAME sh -c 'exec mysqldump --all-databases -uroot -p$DB_PASS' > $OUTPUT");

            shell.AddParameter("DB_NAME", this._dbName);
            shell.AddParameter("DB_PASS", this._dbPass);
            shell.AddParameter("OUTPUT", backupOutputPath); // .../backup.sql

            await shell.InvokeAsync();

            // also backup recipesPictures
        }

        public async Task Restore(string backupInputPath)
        {
            if (string.IsNullOrEmpty(this._dbPass)) return;

            using PowerShell shell = PowerShell.Create();
            
            shell.AddScript($"Get-Content $INPUT | docker exec -i $DB_NAME sh -c 'exec mysql -uroot -p$DB_PASS'");

            shell.AddParameter("DB_NAME", this._dbName);
            shell.AddParameter("DB_PASS", this._dbPass);
            shell.AddParameter("INPUT", backupInputPath); // .../backup.sql

            await shell.InvokeAsync();

            // also restore recipesPictures
        }
    }
}