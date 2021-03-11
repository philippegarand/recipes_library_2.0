using System.Collections.Generic;

namespace Models
{
    public class Recipe
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public string TimeToMake { get; set; }
        public string ForHowMany { get; set; }
        public int Rating { get; set; }
        public string PictureData { get; set; }
        public bool Favorite { get; set; }
        public string Type { get; set; }

        public List<Tag> Tags { get; set; }
        public List<Ingredient> Ingredients { get; set; }
        public List<HomeIngredient> AtHomeIngredients { get; set; }
        public List<Comment> Comments { get; set; }
        public List<Step> Steps { get; set; }
    }
}