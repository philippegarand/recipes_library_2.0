using System.Collections.Generic;

namespace API.Classes.Views
{
    public class ThumbnailView
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
}
