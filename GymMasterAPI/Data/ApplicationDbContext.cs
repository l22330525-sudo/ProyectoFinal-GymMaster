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
        public DbSet<Modulo> Modulos { get; set; }
        public DbSet<HorarioModulo> HorariosModulo { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var fechaSeed = new DateTime(2026, 1, 1);

            // Cuando se elimina un módulo, sus horarios también se eliminan.
            modelBuilder.Entity<HorarioModulo>()
                .HasOne(h => h.Modulo)
                .WithMany(m => m.Horarios)
                .HasForeignKey(h => h.ModuloId)
                .OnDelete(DeleteBehavior.Cascade);

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

            // Seed de Módulos: Boxeo y Zumba con sus horarios e instructor asignado.
            modelBuilder.Entity<Modulo>().HasData(
                new Modulo
                {
                    Id = 1,
                    Nombre = "Boxeo",
                    Descripcion = "Aprende técnicas de defensa personal, mejora tu condición física y libera el estrés.",
                    Badge = "BX",
                    Color = "#aa3bff",
                    Activo = true,
                    InstructorId = 1
                },
                new Modulo
                {
                    Id = 2,
                    Nombre = "Zumba",
                    Descripcion = "Baila, quema calorías y diviértete con ritmos latinos. Clases para todos los niveles.",
                    Badge = "ZB",
                    Color = "#ff3b9a",
                    Activo = true,
                    InstructorId = 2
                }
            );

            modelBuilder.Entity<HorarioModulo>().HasData(
                // Boxeo
                new HorarioModulo { Id = 1, ModuloId = 1, DiaSemana = "Lunes",     HoraInicio = "07:00", HoraFin = "08:30", Nivel = "Principiante" },
                new HorarioModulo { Id = 2, ModuloId = 1, DiaSemana = "Miércoles", HoraInicio = "07:00", HoraFin = "08:30", Nivel = "Principiante" },
                new HorarioModulo { Id = 3, ModuloId = 1, DiaSemana = "Viernes",   HoraInicio = "08:00", HoraFin = "09:30", Nivel = "Avanzado" },
                new HorarioModulo { Id = 4, ModuloId = 1, DiaSemana = "Sábado",    HoraInicio = "09:00", HoraFin = "11:00", Nivel = "Todos los niveles" },
                // Zumba
                new HorarioModulo { Id = 5, ModuloId = 2, DiaSemana = "Martes",    HoraInicio = "07:00", HoraFin = "08:00", Nivel = "Todos los niveles" },
                new HorarioModulo { Id = 6, ModuloId = 2, DiaSemana = "Jueves",    HoraInicio = "17:00", HoraFin = "18:00", Nivel = "Principiante" },
                new HorarioModulo { Id = 7, ModuloId = 2, DiaSemana = "Miércoles", HoraInicio = "19:00", HoraFin = "20:00", Nivel = "Intermedio" },
                new HorarioModulo { Id = 8, ModuloId = 2, DiaSemana = "Sábado",    HoraInicio = "10:00", HoraFin = "11:30", Nivel = "Todos los niveles" }
            );
        }
    }
}
