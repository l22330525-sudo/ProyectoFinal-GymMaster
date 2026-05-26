using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymMasterAPI.Models
{
    public class Asistencia
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int MiembroId { get; set; }

        [ForeignKey("MiembroId")]
        public Miembro? Miembro { get; set; }

        [Required]
        public DateTime FechaHora { get; set; }
    }
}