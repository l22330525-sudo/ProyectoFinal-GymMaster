using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymMasterAPI.Models
{
    public class Miembro
    {
        [Key] 
        public int Id { get; set; }

        public string Rol { get; set; } = "Cliente";

        [Required(ErrorMessage = "El nombre es obligatorio")]
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "El correo es obligatorio")]
        [EmailAddress] 
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty; 

        public DateTime FechaInscripcion { get; set; } = DateTime.Now;

        public bool EstaActivo { get; set; } = true;

        public int? MembresiaId { get; set; }
        
        [ForeignKey("MembresiaId")]
        public Membresia? Membresia { get; set; }
    }
}