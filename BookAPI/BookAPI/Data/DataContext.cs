using System.Collections.Generic;
using BookAPI.Models;
using Microsoft.EntityFrameworkCore;


namespace BookAPI.Data
{
   
        public class DataContext : DbContext
        {

            public DataContext(DbContextOptions<DataContext> options) : base(options) { }

            public DbSet<Book> Books { get; set; }
        }
    
}
