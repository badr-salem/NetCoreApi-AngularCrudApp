using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookAPI.Data;
using BookAPI.Models;
using System.Web.Http.Results;

namespace BookAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly DataContext _context;

        public BooksController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
        {
            return await _context.Books.ToListAsync();
        }

        //GET: api/Books/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound();
            }

            return book;
        }


        [HttpPost("{id}")]
        public  IActionResult PutBook(int id, Book book)
        {
            //book.Id = id;
            var bookFromDb =  _context.Books.FirstOrDefault(i => i.Id == id);

            if(bookFromDb == null)
            {
                return NotFound();
            }
            else
            {

                if (book.ImagePath == null)
                {
                    //mean doesnt upload a new image ,, keep the old one
                    if (bookFromDb != null)
                    {
                        if (bookFromDb.ImagePath != null)
                        {
                            book.ImagePath = bookFromDb.ImagePath;

                        }
                    }

                }
                else
                {
                    //Mean user Upload a new Image ,, so we must delete old image
                    var pathToSave = Path.Combine(Directory.GetCurrentDirectory());

                    var filePath = Path.Combine(pathToSave, bookFromDb.ImagePath.TrimStart('\\'));

                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);

                    }
                }

                bookFromDb.bookName = book.bookName;
                bookFromDb.authorName = book.authorName;
                bookFromDb.category = book.category;
                bookFromDb.status = book.status;
                bookFromDb.price = book.price;
                bookFromDb.Date = book.Date;
                bookFromDb.ImagePath = book.ImagePath;

                

                Book obj = new Book();

                book = obj;

                _context.Books.Update(bookFromDb);
                _context.SaveChanges();
                return NoContent();

            }

          

           
        }



        // PUT: api/Books/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutBook(int id, Book book)
        //{
        //    book.Id = id;

        //    if (book.ImagePath == null)
        //    {
        //        //mean doesnt upload a new image ,, keep the old one
        //        var bookFromDb = await _context.Books.FirstOrDefaultAsync(i => i.Id == id);
        //        if(bookFromDb != null)
        //        {
        //            if (bookFromDb.ImagePath != null)
        //            {
        //                book.ImagePath = bookFromDb.ImagePath;

        //            }
        //        }

        //    }



        //    //_context.Entry(book).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!BookExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        // POST: api/Books
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Book>> PostBook(Book book)
        {
            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBook", new { id = book.Id }, book);
        }

        // DELETE: api/Books/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            
            if (book == null)
            {
                return NotFound();
            }


            var deleteImage = DeleteImage(id);

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();


            return NoContent();
        }

        private bool BookExists(int id)
        {
            return _context.Books.Any(e => e.Id == id);
        }

       
        private bool DeleteImage(int id)
        {
            bool isExisit = BookExists(id);
            if (isExisit == false)
            {
                return false;
            }

            var bookFromDb =  _context.Books.Find(id);

            if (bookFromDb.ImagePath == null )
            {
                return false;
            }

            //var folderName = Path.Combine("Resources", "Images");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory());

            var filePath = Path.Combine(pathToSave, bookFromDb.ImagePath.TrimStart('\\'));

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
                bookFromDb.ImagePath = null;

                _context.Books.Update(bookFromDb);
                _context.SaveChanges();

                return true;
            }

            return false;

        }



    }
}
