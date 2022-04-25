using API.Entity;
using Microsoft.EntityFrameworkCore;
namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<AppUser> User { get; set; }
        public DbSet<Task> Task { get; set; }
        public DbSet<Status> Status { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Priority> Priority { get; set; }
        public DbSet<Permission> Permissions { get; set; }
    }
}
