using System.ComponentModel.DataAnnotations;

namespace GymMasterAPI.Dtos
{
    public class CrearModuloDto
    {
        [Required(ErrorMessage = "El nombre del módulo es obligatorio")]
        public string Nombre { get; set; } = string.Empty;

        public string Descripcion { get; set; } = string.Empty;

        public string Badge { get; set; } = "MD";
        public string Color { get; set; } = "#aa3bff";
        public bool Activo { get; set; } = true;

        public int? InstructorId { get; set; }

        public List<CrearHorarioModuloDto> Horarios { get; set; } = new();
    }

    public class CrearHorarioModuloDto
    {
        [Required]
        public string DiaSemana { get; set; } = string.Empty;

        [Required]
        public string HoraInicio { get; set; } = string.Empty;

        [Required]
        public string HoraFin { get; set; } = string.Empty;

        public string Nivel { get; set; } = "Todos los niveles";
    }
}
