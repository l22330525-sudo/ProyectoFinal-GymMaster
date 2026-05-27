using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymMasterAPI.Data;
using GymMasterAPI.Models;

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

        // GET: api/Membresias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Membresia>>> GetMembresias()
        {
            return await _context.Membresias.ToListAsync();
        }

        // GET: api/Membresias/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Membresia>> GetMembresia(int id)
        {
            var membresia = await _context.Membresias.FindAsync(id);

            if (membresia == null)
            {
                return NotFound();
            }

            return membresia;
        }
    }
}