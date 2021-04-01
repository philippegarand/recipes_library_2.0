using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EFDataAccessLibrary.DataAccess;
using Models;
using API.Helpers;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipesController : ControllerBase
    {
        private readonly RecipesContext _context;

        public RecipesController(RecipesContext context)
        {
            _context = context;
        }

        // SEARCH QUERY CALL

        // POST: api/Recipes (fake get, cause I need body...)
        [HttpPost]
        [Route("thumbnails")]
        public async Task<ActionResult<PaginatedListHelper<RecipeThumbnail>>> GetRecipesQuery([FromBody] RecipeQuery query)
        {
            try
            {
                var recipes = from r in _context.Recipes select r;

                if (!string.IsNullOrEmpty(query.NameLike))
                    recipes = recipes.Where(r => r.Title.Contains(query.NameLike));

                // order by made client side to prevent api spam

                #region [FilterBy]

                //switch (query.FilterBy)
                //{
                //    case "alphabetical":
                //        recipes = recipes.OrderBy(r => r.Title);
                //        break;

                //    case "alphabetical reversed":
                //        recipes = recipes.OrderByDescending(r => r.Title);
                //        break;

                //    case "time":
                //        var preferences = new List<string> { "Court", "Moyen", "Long" };
                //        recipes = recipes.OrderBy(r => preferences.IndexOf(r.TimeToMake));
                //        break;

                //    case "rating":
                //        recipes = recipes.OrderByDescending(r => r.Rating);
                //        break;

                //    case "favorite":
                //        recipes = recipes.OrderByDescending(r => r.Favorite);
                //        break;

                //    default:
                //        break;
                //}

                #endregion [FilterBy]

                if (query.TagsIds.Count > 0)
                    recipes = recipes.Where(r => r.Tags.Where(t => query.TagsIds.Contains(t.ID)).Distinct().Count() == query.TagsIds.Distinct().Count());

                var items = recipes.AsNoTracking().Select(r => new RecipeThumbnail
                {
                    Id = r.ID,
                    Title = r.Title,
                    Rating = r.Rating,
                    Favorite = r.Favorite,
                    TimeToMake = r.TimeToMake,
                    Type = r.Type,
                    Tags = r.Tags.Select(t => new TagView { ID = t.ID, Text = t.Text }).ToList(),
                    PictureData = PictureHelper.GetDataFromPicture(r.ID),
                });

                var res = await PaginatedListHelper<RecipeThumbnail>.CreateAsync(items, query.Page, query.PerPage);

                // tried to do async, but ForEach is not compatible... find solution later?
                //res.ForEach(async r => r.PictureData = await PictureHelper.GetDataFromPicture(r.Id));

                return Ok(new RecipeThumbnails { Page = res.Page, TotalPages = res.TotalPages, Thumbnails = res });
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }

        // GET: api/Recipes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Recipe>> GetRecipe(int id)
        {
            try
            {
                var recipe = await _context.Recipes
                    .Include(r => r.Ingredients)
                    .Include(r => r.HomeIngredients)
                    .Include(r => r.Steps)
                    .Include(r => r.Comments)
                    .Include(r => r.Tags)
                    .FirstAsync(r => r.ID == id);

                if (recipe == null)
                    return NotFound();

                var view = new RecipeView
                {
                    ID = recipe.ID,
                    Title = recipe.Title,
                    TimeToMake = recipe.TimeToMake,
                    ForHowMany = recipe.ForHowMany,
                    Rating = recipe.Rating,
                    Favorite = recipe.Favorite,
                    Type = recipe.Type,
                    PictureData = PictureHelper.GetDataFromPicture(recipe.ID),
                    Ingredients = recipe.Ingredients,
                    HomeIngredients = recipe.HomeIngredients,
                    Comments = recipe.Comments.OrderByDescending(c => c.CommentedOn).ToList(),
                    Steps = recipe.Steps,
                    Tags = recipe.Tags.Select(t => new TagView { ID = t.ID, Text = t.Text }).ToList()
                };

                return Ok(view);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }

        // PUT: api/Recipes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRecipe(int id, Recipe recipe)
        {
            if (id != recipe.ID)
            {
                return BadRequest();
            }

            _context.Entry(recipe).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RecipeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Recipes
        [HttpPost]
        public async Task<ActionResult<Recipe>> PostRecipe([FromBody] Recipe recipe)
        {
            try
            {
                recipe.Tags = recipe.Tags.Select(t => _context.Tags.First(x => x.ID == t.ID)).ToList();

                _context.Recipes.Add(recipe);
                await _context.SaveChangesAsync();

                await PictureHelper.SavePictureFromData(recipe.ID, recipe.PictureData);

                return Created("Recipe", recipe.ID);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }

        // POST: api/Recipes/5/comment
        [HttpPost("{id}/comment")]
        public async Task<ActionResult<Recipe>> PostComment(int id, [FromBody] string comment)
        {
            try
            {
                var recipe = await _context.Recipes.Include(r => r.Comments).FirstAsync(r => r.ID == id);

                if (recipe == null)
                    return NotFound();

                var newComment = new Comment { Text = comment };
                recipe.Comments.Add(newComment);
                await _context.SaveChangesAsync();

                return Created("Comment", newComment);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }

        // PUT: api/Recipes/5/favorite
        [HttpPatch("{id}/favorite")]
        public async Task<IActionResult> PatchFavorite(int id, bool favorite)
        {
            var recipe = await _context.Recipes.FindAsync(id);

            if (recipe == null)
                return NotFound();

            recipe.Favorite = favorite;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RecipeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // PUT: api/Recipes/5/rating
        [HttpPatch("{id}/rating")]
        public async Task<IActionResult> PatchRating(int id, int rating)
        {
            var recipe = await _context.Recipes.FindAsync(id);

            if (recipe == null)
                return NotFound();

            recipe.Rating = rating;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RecipeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool RecipeExists(int id)
        {
            return _context.Recipes.Any(e => e.ID == id);
        }
    }
}