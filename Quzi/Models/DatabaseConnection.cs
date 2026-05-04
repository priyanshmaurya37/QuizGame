using Microsoft.EntityFrameworkCore;

namespace Quzi.Models
{
    public class DatabaseConnection : DbContext
    {
        public DatabaseConnection(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Quzi_Add_Q> Quzi_Add_Q { get; set; }
        public DbSet<StudentList> StudentList { get; set; }


    }
}
