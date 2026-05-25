using Microsoft.EntityFrameworkCore;
using GymMasterAPI.Models;

namespace GymMasterAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<Miembro> Miembros { get; set; }
        public DbSet<Instructor> Instructores { get; set; }
        public DbSet<Membresia> Membresias { get; set; }
    }
}