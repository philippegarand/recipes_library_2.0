using API.Helpers.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BackupController : ControllerBase
    {
        private readonly IBackupHelper _backupHelper;

        public BackupController(IBackupHelper backupHelper)
        {
            this._backupHelper = backupHelper;
        }

        [HttpPost]
        [Route("dump")]
        public async Task<IActionResult> DumpDatabase([FromBody] string backupOutputPath)
        {
            await this._backupHelper.Dump(backupOutputPath);
            return Ok();
        }

        [HttpPost]
        [Route("restore")]
        public async Task<IActionResult> RestoreDatabase([FromBody] string backupInputPath)
        {
            await this._backupHelper.Restore(backupInputPath);
            return Ok();
        }
    }
}