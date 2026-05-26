using GymMasterAPI.Data;
using GymMasterAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace GymMasterAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AsistenciasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AsistenciasController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("registrar")]
        public async Task<IActionResult> RegistrarAsistencia([FromBody] int miembroId)
        {
            var miembro = await _context.Miembros.FindAsync(miembroId);
            if (miembro == null)
            {
                return NotFound("Socio no encontrado.");
            }

            var nuevaAsistencia = new Asistencia
            {
                MiembroId = miembroId,
                FechaHora = DateTime.Now
            };

            _context.Asistencias.Add(nuevaAsistencia);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "¡Asistencia registrada con éxito! Bienvenido al gimnasio." });
        }
    }
}