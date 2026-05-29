using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymMasterAPI.Data;
using GymMasterAPI.Models;
using GymMasterAPI.Dtos;

namespace GymMasterAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModulosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ModulosController(ApplicationDbContext context)
        {
            _context = context;
        }

        private static ModuloDto MapearADto(Modulo m) => new ModuloDto
        {
            Id = m.Id,
            Nombre = m.Nombre,
            Descripcion = m.Descripcion,
            Badge = m.Badge,
            Color = m.Color,
            Activo = m.Activo,
            InstructorId = m.InstructorId,
            InstructorNombre = m.Instructor?.NombreCompleto,
            Horarios = m.Horarios
                .OrderBy(h => h.HoraInicio)
                .Select(h => new HorarioModuloDto
                {
                    Id = h.Id,
                    DiaSemana = h.DiaSemana,
                    HoraInicio = h.HoraInicio,
                    HoraFin = h.HoraFin,
                    Nivel = h.Nivel
                })
                .ToList()
        };

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ModuloDto>>> GetModulos()
        {
            var modulos = await _context.Modulos
                .Include(m => m.Instructor)
                .Include(m => m.Horarios)
                .ToListAsync();

            return modulos.Select(MapearADto).ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ModuloDto>> GetModulo(int id)
        {
            var modulo = await _context.Modulos
                .Include(m => m.Instructor)
                .Include(m => m.Horarios)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (modulo == null) return NotFound();

            return MapearADto(modulo);
        }

        [HttpPost]
        public async Task<ActionResult<ModuloDto>> CrearModulo([FromBody] CrearModuloDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Los datos del módulo no son válidos.");
            }

            var nuevoModulo = new Modulo
            {
                Nombre = dto.Nombre,
                Descripcion = dto.Descripcion,
                Badge = string.IsNullOrWhiteSpace(dto.Badge) ? "MD" : dto.Badge,
                Color = string.IsNullOrWhiteSpace(dto.Color) ? "#aa3bff" : dto.Color,
                Activo = dto.Activo,
                InstructorId = dto.InstructorId,
                Horarios = dto.Horarios.Select(h => new HorarioModulo
                {
                    DiaSemana = h.DiaSemana,
                    HoraInicio = h.HoraInicio,
                    HoraFin = h.HoraFin,
                    Nivel = string.IsNullOrWhiteSpace(h.Nivel) ? "Todos los niveles" : h.Nivel
                }).ToList()
            };

            _context.Modulos.Add(nuevoModulo);
            await _context.SaveChangesAsync();

            // Volvemos a leer con includes para devolver la respuesta completa.
            await _context.Entry(nuevoModulo).Reference(m => m.Instructor).LoadAsync();

            return CreatedAtAction(nameof(GetModulo), new { id = nuevoModulo.Id }, MapearADto(nuevoModulo));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarModulo(int id, [FromBody] CrearModuloDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Los datos proporcionados no son válidos.");
            }

            var modulo = await _context.Modulos
                .Include(m => m.Horarios)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (modulo == null)
            {
                return NotFound("Módulo no encontrado.");
            }

            modulo.Nombre = dto.Nombre;
            modulo.Descripcion = dto.Descripcion;
            modulo.Badge = string.IsNullOrWhiteSpace(dto.Badge) ? modulo.Badge : dto.Badge;
            modulo.Color = string.IsNullOrWhiteSpace(dto.Color) ? modulo.Color : dto.Color;
            modulo.Activo = dto.Activo;
            modulo.InstructorId = dto.InstructorId;

            // Reemplazamos por completo la lista de horarios.
            _context.HorariosModulo.RemoveRange(modulo.Horarios);
            modulo.Horarios = dto.Horarios.Select(h => new HorarioModulo
            {
                DiaSemana = h.DiaSemana,
                HoraInicio = h.HoraInicio,
                HoraFin = h.HoraFin,
                Nivel = string.IsNullOrWhiteSpace(h.Nivel) ? "Todos los niveles" : h.Nivel
            }).ToList();

            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "¡Módulo actualizado con éxito!" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarModulo(int id)
        {
            var modulo = await _context.Modulos.FindAsync(id);
            if (modulo == null) return NotFound("Módulo no encontrado.");

            _context.Modulos.Remove(modulo);
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "¡Módulo eliminado correctamente!" });
        }
    }
}
