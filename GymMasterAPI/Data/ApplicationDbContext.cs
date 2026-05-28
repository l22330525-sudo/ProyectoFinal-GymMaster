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
        public DbSet<Asistencia> Asistencias { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var fechaSeed = new DateTime(2026, 1, 1);

            modelBuilder.Entity<Membresia>().HasData(
                new Membresia { Id = 1, Nombre = "Plan Diario",       Costo = 50,  DuracionDias = 1,  Descripcion = "Acceso completo al gimnasio por un día. Ideal para visitantes o prueba." },
                new Membresia { Id = 2, Nombre = "Plan Semanal",      Costo = 200, DuracionDias = 7,  Descripcion = "Una semana completa de entrenamiento sin restricciones." },
                new Membresia { Id = 3, Nombre = "Plan Mensual",      Costo = 600, DuracionDias = 30, Descripcion = "Un mes entero con acceso completo. La mejor opción para resultados reales." },
                new Membresia { Id = 4, Nombre = "Diario + Módulo",   Costo = 150, DuracionDias = 1,  Descripcion = "Acceso diario al gimnasio más un módulo de Boxeo o Zumba a tu elección." },
                new Membresia { Id = 5, Nombre = "Semanal + Módulo",  Costo = 300, DuracionDias = 7,  Descripcion = "Una semana con acceso al gimnasio y clases de Boxeo o Zumba incluidas." },
                new Membresia { Id = 6, Nombre = "Mensual + Módulo",  Costo = 700, DuracionDias = 30, Descripcion = "El plan más completo. Un mes con gimnasio y clases de Boxeo o Zumba." }
            );

            modelBuilder.Entity<Instructor>().HasData(
                new Instructor { Id = 1, NombreCompleto = "Carlos Cordova",  Especialidad = "Boxeo",                    Turno = "Matutino y Vespertino", EstaActivo = true },
                new Instructor { Id = 2, NombreCompleto = "Valeria Ríos",    Especialidad = "Zumba y ritmos latinos",   Turno = "Matutino y Vespertino", EstaActivo = true }
            );

            modelBuilder.Entity<Miembro>().HasData(
                new Miembro
                {
                    Id = 1,
                    Rol = "Admin",
                    Nombre = "Administrador",
                    Email = "admin@gym.com",
                    Password = "admin123",
                    FechaInscripcion = fechaSeed,
                    EstaActivo = true,
                    MembresiaId = null
                },
                new Miembro
                {
                    Id = 2,
                    Rol = "Recepcionista",
                    Nombre = "Recepción Principal",
                    Email = "recepcion@gym.com",
                    Password = "recepcion123",
                    FechaInscripcion = fechaSeed,
                    EstaActivo = true,
                    MembresiaId = null
                }
            );
        }
    }
}
