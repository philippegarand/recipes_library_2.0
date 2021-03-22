using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class PaginatedListHelper<T> : List<T>
    {
        public int Page { get; private set; }
        public int TotalPages { get; private set; }

        public PaginatedListHelper(List<T> items, int count, int page, int pageSize)
        {
            Page = page;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            AddRange(items);
        }

        public bool HasPreviousPage
        {
            get
            {
                return Page > 1;
            }
        }

        public bool HasNextPage
        {
            get
            {
                return Page < TotalPages;
            }
        }

        public static async Task<PaginatedListHelper<T>> CreateAsync(IQueryable<T> source, int page, int pageSize)
        {
            var count = await source.CountAsync();
            var items = await source.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            return new PaginatedListHelper<T>(items, count, page, pageSize);
        }
    }
}