using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    public class TagDTO
    {
        public string Text { get; set; }
    }

    public class Tag
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        [Required, MaxLength(20)]
        public string Text { get; set; }

        public ICollection<Recipe> Recipes { get; set; }
    }

    public class TagView
    {
        public int ID { get; set; }
        public string Text { get; set; }
    }
}