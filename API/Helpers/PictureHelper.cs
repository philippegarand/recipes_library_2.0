using System;
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

        public static string GetDataFromPicture(int recipeId)
        {
            try
            {
                var data = System.IO.File.ReadAllBytes($"{Environment.GetEnvironmentVariable("PICTURES_SOURCE")}/recipe_{recipeId}.jpg");
                return Convert.ToBase64String(data);
            }
            catch
            {
                return "";
            }            
        }
    }
}