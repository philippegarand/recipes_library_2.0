using System.Collections.Generic;

namespace Models
{
    public class RecipeThumbnail
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string TimeToMake { get; set; }
        public int Rating { get; set; }
        public string PictureData { get; set; }
        public bool Favorite { get; set; }
        public string Type { get; set; }
        public List<TagView> Tags { get; set; }
    }

    public class RecipeThumbnails
    {
        public int Page { get; set; }
        public int TotalPages { get; set; }
        public List<RecipeThumbnail> Thumbnails { get; set; }
    }
}