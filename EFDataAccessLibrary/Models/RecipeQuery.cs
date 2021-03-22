using System.Collections.Generic;

namespace Models
{
    public class RecipeQuery
    {
        public int PerPage { get; set; }
        public int Page { get; set; }
        public List<int> TagsIds { get; set; }
        public string NameLike { get; set; }
        //public string FilterBy { get; set; }
    }
}