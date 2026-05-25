using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymMasterAPI.Data;
using GymMasterAPI.Models;

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

        // GET: api/Instructores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Instructor>>> GetInstructores()
        {
            return await _context.Instructores.ToListAsync();
        }

        // GET: api/Instructores/5
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
    }
}