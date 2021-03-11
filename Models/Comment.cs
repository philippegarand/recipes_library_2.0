using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models
{
    public class Comment
    {
        public int? Id { get; set; }
        public int? RecipeId { get; set; }
        public string Content { get; set; }
        public string CommentedOn { get; set; }
    }
}