using System.ComponentModel.DataAnnotations;

namespace GymMasterAPI.Dtos
{
    public class ActualizarMiembroDto
    {
        [Required(ErrorMessage = "El nombre es obligatorio")]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "El correo es obligatorio")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string? Password { get; set; }

        public bool EstaActivo { get; set; }

        public int? MembresiaId { get; set; }
    }
}