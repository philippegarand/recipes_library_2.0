using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EFDataAccessLibrary.Models
{
    public class Changes
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