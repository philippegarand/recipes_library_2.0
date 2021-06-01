using System.Collections.Generic;

namespace API.Classes.Dtos
{
    public class SearchQueryDto
    {
        public int PerPage { get; set; }
        public int Page { get; set; }
        public List<int> TagsIds { get; set; }
        public string NameLike { get; set; }
        //public string FilterBy { get; set; }
    }
}
