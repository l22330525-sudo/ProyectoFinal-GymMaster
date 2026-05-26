using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymMasterAPI.Data;
using GymMasterAPI.Models;
using GymMasterAPI.Dtos;

namespace GymMasterAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MiembrosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MiembrosController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Miembro>>> GetMiembros()
        {
            return await _context.Miembros
                                 .Include(m => m.Membresia)
                                 .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Miembro>> GetMiembro(int id)
        {
            var miembro = await _context.Miembros
                                        .Include(m => m.Membresia)
                                        .FirstOrDefaultAsync(m => m.Id == id);

            if (miembro == null)
            {
                return NotFound();
            }

            return miembro;
        }

        [HttpPost]
        public async Task<IActionResult> CrearMiembro([FromBody] RegistrarMiembroDto miembroDto)
        {
            if (miembroDto == null)
            {
                return BadRequest("Los datos del miembro no son válidos.");
            }

            var nuevoMiembro = new Miembro
            {
                Nombre = miembroDto.Nombre,
                Email = miembroDto.Email,
                Password = miembroDto.Password,
                FechaInscripcion = DateTime.Now,
                EstaActivo = true,
                MembresiaId = miembroDto.MembresiaId
            };

            _context.Miembros.Add(nuevoMiembro);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMiembro), new { id = nuevoMiembro.Id }, nuevoMiembro);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (loginDto == null || string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
            {
                return BadRequest("Por favor, llena todos los campos.");
            }

            var miembro = await _context.Miembros
                .FirstOrDefaultAsync(m => m.Email == loginDto.Email && m.Password == loginDto.Password);

            if (miembro == null)
            {
                return Unauthorized("Correo electrónico o contraseña incorrectos.");
            }

            if (!miembro.EstaActivo)
            {
                return BadRequest("Tu cuenta se encuentra inactiva. Acude a recepción.");
            }

            return Ok(new { 
                id = miembro.Id, 
                nombre = miembro.Nombre, 
                email = miembro.Email 
            });
        }
    }
}