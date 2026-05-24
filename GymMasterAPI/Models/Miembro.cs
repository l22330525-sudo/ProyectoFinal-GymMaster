using System.ComponentModel.DataAnnotations;

namespace GymMasterAPI.Models
{
    public class Miembro
    {
        [Key] 
        public int Id { get; set; }

        [Required(ErrorMessage = "El nombre es obligatorio")]
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "El correo es obligatorio")]
        [EmailAddress] 
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty; 

        public DateTime FechaInscripcion { get; set; } = DateTime.Now;

        public bool IncluyeBoxeo { get; set; }
        public bool IncluyeDanza { get; set; }
        public decimal MontoMensual { get; set; }
    }
}