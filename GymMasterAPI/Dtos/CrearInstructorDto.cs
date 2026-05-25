using System.ComponentModel.DataAnnotations;

namespace GymMasterAPI.Dtos
{
    // Este es el que recibes desde el formulario de React (NO tiene ID ni estado activo, porque por defecto entran activos)
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