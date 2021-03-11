namespace Models
{
    public class ThumbnailsQuery
    {
        public int PerPage { get; set; }
        public int Page { get; set; }
        public string TagsIds { get; set; }
        public string NameLike { get; set; }
        public string FilterBy { get; set; }
    }
}