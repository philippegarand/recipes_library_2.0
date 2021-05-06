using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EFDataAccessLibrary.Models
{
    public class Changes
    {
        public ChangedItemObj<string> Title { get; set; }
        public ChangedItemObj<string> ForHowMany { get; set; } // 2-3 / 4-5
        public ChangedItemObj<string> TimeToMake { get; set; } //Court / Moyen / Long
        public List<dynamic> Tags { get; set; }
        public List<dynamic> Ingredients { get; set; }
        public List<dynamic> HomeIngredients { get; set; }
        public List<dynamic> Steps { get; set; }
    }

    public class ChangedItemObj<T>
    {
        public string Type { get; set; } //created updated deleted unchanged
        public T Data { get; set; }
    }

    public class NormalItem
    {
        public int Id { get; set; }
        public int Number { get; set; }
        public string Text { get; set; }
    }

    public class ChangedItem
    {
        public ChangedItemObj<int> Id { get; set; }
        public ChangedItemObj<int> Number { get; set; }
        public ChangedItemObj<string> Text { get; set; }
    }

    public class ChangedTag
    {
        public ChangedItemObj<int> Id { get; set; }
        public ChangedItemObj<string> Text { get; set; }
    }
}