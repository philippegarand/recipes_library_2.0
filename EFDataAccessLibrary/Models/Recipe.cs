using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    public class Recipe
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        [Required, MaxLength(100)]
        public string Title { get; set; }

        [Comment("Court / Moyen / Long")]
        [Required, MaxLength(5), Column(TypeName = "varchar(5)")]
        public string TimeToMake { get; set; }

        [Comment("2-3 / 4-5")]
        [Required, MaxLength(3), Column(TypeName = "varchar(3)")]
        public string ForHowMany { get; set; }

        [Required]
        public int Rating { get; set; }

        [Required]
        public bool Favorite { get; set; }

        [Comment("Old / New")]
        [Required, MaxLength(3), Column(TypeName = "varchar(3)")]
        public string Type { get; set; }

        [NotMapped]
        public string PictureData { get; set; }

        public List<Ingredient> Ingredients { get; set; }

        public List<HomeIngredient> HomeIngredients { get; set; }

        public List<Comment> Comments { get; set; }

        public List<Step> Steps { get; set; }

        public ICollection<Tag> Tags { get; set; }
    }
}