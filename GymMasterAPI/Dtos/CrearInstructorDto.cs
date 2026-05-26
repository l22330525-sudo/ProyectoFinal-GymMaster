using System.ComponentModel.DataAnnotations;

namespace GymMasterAPI.Dtos
{
    public class CrearInstructorDto
    {
        [Required(ErrorMessage = "El nombre del instructor es obligatorio")]
        public string NombreCompleto { get; set; } = string.Empty;

        [Required]
        public string Especialidad { get; set; } = string.Empty;

        [Required]
        public string Turno { get; set; } = string.Empty;
    }
}