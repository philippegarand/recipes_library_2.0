using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EFDataAccessLibrary.DataAccess;
using Models;
using API.Classes.Views;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagsController : ControllerBase
    {
        private readonly RecipesContext _context;

        public TagsController(RecipesContext context)
        {
            _context = context;
        }

        // GET: api/Tags
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagView>>> GetTags()
        {
            try
            {
                var res = await _context.Tags.Select(x => new TagView
                {
                    ID = x.ID,
                    Text = x.Text
                }).ToListAsync();

                return Ok(res);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }

        // POST: api/Tags
        [HttpPost]
        public async Task<ActionResult<TagView>> PostTag([FromBody] string tag)
        {
            try
            {
                var newTag = new Tag { Text = tag };

                _context.Tags.Add(newTag);
                await _context.SaveChangesAsync();

                return StatusCode(StatusCodes.Status201Created, new TagView { ID = newTag.ID, Text = newTag.Text });           
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }
    }
}