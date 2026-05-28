using System.ComponentModel.DataAnnotations;

namespace GymMasterAPI.Dtos
{
    public class RegistrarMiembroDto
    {
        [Required(ErrorMessage = "El nombre es obligatorio")]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "El correo es obligatorio")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es obligatoria")]
        public string Password { get; set; } = string.Empty;

        public int? MembresiaId { get; set; }
    }
}