using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymMasterAPI.Data;
using GymMasterAPI.Models;
using GymMasterAPI.Dtos;

namespace GymMasterAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembresiasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MembresiasController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Membresia>>> GetMembresias()
        {
            return await _context.Membresias.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Membresia>> GetMembresia(int id)
        {
            var membresia = await _context.Membresias.FindAsync(id);
            if (membresia == null) return NotFound();
            return membresia;
        }

        [HttpPost]
        public async Task<ActionResult<Membresia>> CrearMembresia([FromBody] CrearMembresiaDto dto)
        {
            var membresia = new Membresia { 
                Nombre = dto.Nombre, 
                Costo = dto.Costo, 
                DuracionDias = dto.DuracionDias,
                Descripcion = dto.Descripcion 
            };
            _context.Membresias.Add(membresia);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMembresia), new { id = membresia.Id }, membresia);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarMembresia(int id, [FromBody] CrearMembresiaDto dto)
        {
            var m = await _context.Membresias.FindAsync(id);
            if (m == null) return NotFound();
            
            m.Nombre = dto.Nombre;
            m.Costo = dto.Costo;
            m.DuracionDias = dto.DuracionDias;
            m.Descripcion = dto.Descripcion;
            
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Membresía actualizada con éxito" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarMembresia(int id)
        {
            var m = await _context.Membresias.FindAsync(id);
            if (m == null) return NotFound();
            
            _context.Membresias.Remove(m);
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Membresía eliminada correctamente" });
        }
    }
}