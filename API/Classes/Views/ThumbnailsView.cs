using System.Collections.Generic;

namespace API.Classes.Views
{
    public class ThumbnailsView
    {
        public int Page { get; set; }
        public int TotalPages { get; set; }
        public List<ThumbnailView> Thumbnails { get; set; }
    }
}
