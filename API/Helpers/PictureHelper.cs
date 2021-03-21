using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public static class PictureHelper
    {
        public static async Task SavePictureFromData(int recipeId, string data)
        {
            string path = $"{Environment.GetEnvironmentVariable("PICTURES_SOURCE")}/recipe_{recipeId}.jpg";
            await System.IO.File.WriteAllBytesAsync(path, Convert.FromBase64String(data));
        }

        public static async Task<string> GetDataFromPicture(int recipeId)
        {
            var data = await System.IO.File.ReadAllBytesAsync($"{Environment.GetEnvironmentVariable("PICTURES_SOURCE")}/recipe_{recipeId}.jpg");
            return Convert.ToBase64String(data);
        }
    }
}