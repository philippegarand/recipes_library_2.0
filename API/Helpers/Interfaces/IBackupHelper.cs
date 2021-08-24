using System.Threading.Tasks;

namespace API.Helpers.Interfaces
{
    public interface IBackupHelper
    {
        Task Dump(string backupOutputPath);

        Task Restore(string backupInputPath);
    }
}