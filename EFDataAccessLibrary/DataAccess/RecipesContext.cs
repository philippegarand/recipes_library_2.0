using Microsoft.EntityFrameworkCore;
using Models;
using System.Collections.Generic;

namespace EFDataAccessLibrary.DataAccess
{
    public class RecipesContext : DbContext
    {
        public RecipesContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<HomeIngredient> HomeIngredients { get; set; }
        public DbSet<Step> Steps { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Recipe>()
                .HasMany(r => r.Tags)
                .WithMany(t => t.Recipes)
                .UsingEntity<Dictionary<string, object>>(
                "RecipesTags",
                j => j
                    .HasOne<Tag>()
                    .WithMany()
                    .HasForeignKey("TagId"),
                j => j
                    .HasOne<Recipe>()
                    .WithMany()
                    .HasForeignKey("RecipeId"));

            modelBuilder.Entity<Tag>()
                .HasIndex(t => t.Text)
                .IsUnique();

            modelBuilder.Entity<Tag>().HasData(
                new Tag { ID = 1, Text = "Porc" },
                new Tag { ID = 2, Text = "Poulet" },
                new Tag { ID = 3, Text = "Boeuf" },
                new Tag { ID = 4, Text = "Crevettes" },
                new Tag { ID = 5, Text = "Poisson" },
                new Tag { ID = 6, Text = "Pâtes" },
                new Tag { ID = 7, Text = "Végé" },
                new Tag { ID = 8, Text = "Lait" },
                new Tag { ID = 9, Text = "Épicé" },
                new Tag { ID = 10, Text = "Grecque" },
                new Tag { ID = 11, Text = "Mexicain" },
                new Tag { ID = 12, Text = "Italien" },
                new Tag { ID = 13, Text = "Asiatique" }
            );
        }
    }
}