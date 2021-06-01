using Models;
using System.Collections.Generic;

namespace API.Classes.Dtos
{
    public class RecipeChangesDto
    {
        public string Title { get; set; }
        public string ForHowMany { get; set; } // 2-3 / 4-5
        public string TimeToMake { get; set; } //Court / Moyen / Long
        public List<Tag> Tags { get; set; }
        public List<Ingredient> Ingredients { get; set; }
        public List<HomeIngredient> HomeIngredients { get; set; }
        public List<Step> Steps { get; set; }
    }
}
