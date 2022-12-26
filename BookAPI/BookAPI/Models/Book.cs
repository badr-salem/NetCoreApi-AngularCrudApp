using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string bookName { get; set; }
        public string authorName { get; set; }
        public string category { get; set; }
        public string status { get; set; }
        public double price { get; set; }

        public DateTime Date { get; set; }

        public string? ImagePath { get; set; }



    }
}
