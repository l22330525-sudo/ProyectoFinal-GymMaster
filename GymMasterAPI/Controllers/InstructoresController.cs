using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymMasterAPI.Data;
using GymMasterAPI.Models;
using GymMasterAPI.Dtos;

namespace GymMasterAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstructoresController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InstructoresController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Instructor>>> GetInstructores()
        {
            return await _context.Instructores.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Instructor>> GetInstructor(int id)
        {
            var instructor = await _context.Instructores.FindAsync(id);

            if (instructor == null)
            {
                return NotFound();
            }

            return instructor;
        }

        [HttpPost]
        public async Task<ActionResult<Instructor>> CrearInstructor([FromBody] CrearInstructorDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Los datos del instructor no son válidos.");
            }

            var nuevoInstructor = new Instructor
            {
                NombreCompleto = dto.NombreCompleto,
                Especialidad = dto.Especialidad,
                Turno = dto.Turno,
                EstaActivo = true
            };

            _context.Instructores.Add(nuevoInstructor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInstructor), new { id = nuevoInstructor.Id }, nuevoInstructor);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarInstructor(int id, [FromBody] InstructorDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Los datos proporcionados no son válidos.");
            }

            var instructor = await _context.Instructores.FindAsync(id);
            if (instructor == null)
            {
                return NotFound("Instructor no encontrado en el sistema.");
            }

            instructor.NombreCompleto = dto.NombreCompleto;
            instructor.Especialidad = dto.Especialidad;
            instructor.Turno = dto.Turno;
            instructor.EstaActivo = dto.EstaActivo;

            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "¡Instructor actualizado con éxito!" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarInstructor(int id)
        {
            var instructor = await _context.Instructores.FindAsync(id);
            if (instructor == null)
            {
                return NotFound("Instructor no encontrado.");
            }

            _context.Instructores.Remove(instructor);
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "¡Instructor eliminado correctamente!" });
        }
    }
}
