using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymMasterAPI.Data;
using GymMasterAPI.Models;

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

        // GET: api/Miembros
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Miembro>>> GetMiembros()
        {
            // Usamos Include para traer los datos de la Membresia relacionada
            return await _context.Miembros
                                 .Include(m => m.Membresia)
                                 .ToListAsync();
        }

        // GET: api/Miembros/5
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
    }
}