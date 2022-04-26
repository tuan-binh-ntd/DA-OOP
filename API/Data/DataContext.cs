using API.Entity;
using Microsoft.EntityFrameworkCore;
namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<AppUser> AppUser { get; set; }
        public DbSet<Task> Task { get; set; }
        public DbSet<Status> Status { get; set; }
        public DbSet<Project> Project { get; set; }
        public DbSet<Priority> Priority { get; set; }
        public DbSet<Permission> Permission { get; set; }
        public DbSet<Account> Account { get; set; }
        public DbSet<Department> Department { get; set; }

    }
}
