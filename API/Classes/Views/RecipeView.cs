using Models;
using System.Collections.Generic;

namespace API.Classes.Views
{
    public class RecipeView
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string TimeToMake { get; set; }
        public string ForHowMany { get; set; }
        public int Rating { get; set; }
        public bool Favorite { get; set; }
        public string Type { get; set; }
        public string PictureData { get; set; }
        public List<Ingredient> Ingredients { get; set; }
        public List<HomeIngredient> HomeIngredients { get; set; }
        public List<Comment> Comments { get; set; }
        public List<Step> Steps { get; set; }
        public List<TagView> Tags { get; set; }
    }
}
