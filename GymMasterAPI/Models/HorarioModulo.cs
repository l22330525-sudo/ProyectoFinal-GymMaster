using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymMasterAPI.Models
{
    public class HorarioModulo
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ModuloId { get; set; }

        [ForeignKey("ModuloId")]
        public Modulo? Modulo { get; set; }

        // Día de la semana: "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo".
        [Required]
        [MaxLength(15)]
        public string DiaSemana { get; set; } = string.Empty;

        // Hora de inicio en formato 24 horas: "07:00".
        [Required]
        [MaxLength(5)]
        public string HoraInicio { get; set; } = string.Empty;

        // Hora de fin en formato 24 horas: "08:30".
        [Required]
        [MaxLength(5)]
        public string HoraFin { get; set; } = string.Empty;

        // Nivel de la clase: "Principiante", "Intermedio", "Avanzado", "Todos los niveles".
        [MaxLength(30)]
        public string Nivel { get; set; } = "Todos los niveles";
    }
}
