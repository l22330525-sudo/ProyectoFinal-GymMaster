using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymMasterAPI.Models
{
    public class Modulo
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "El nombre del módulo es obligatorio")]
        [MaxLength(60)]
        public string Nombre { get; set; } = string.Empty;

        [MaxLength(250)]
        public string Descripcion { get; set; } = string.Empty;

        // Identificador corto que el frontend usa para mostrar la insignia (BX, ZB, etc.)
        [MaxLength(4)]
        public string Badge { get; set; } = "MD";

        // Color en formato hexadecimal (#aa3bff). Se usa en el frontend para temar la vista del módulo.
        [MaxLength(9)]
        public string Color { get; set; } = "#aa3bff";

        public bool Activo { get; set; } = true;

        // Instructor asignado al módulo (opcional).
        public int? InstructorId { get; set; }

        [ForeignKey("InstructorId")]
        public Instructor? Instructor { get; set; }

        public List<HorarioModulo> Horarios { get; set; } = new();
    }
}
