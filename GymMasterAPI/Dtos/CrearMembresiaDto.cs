using System.ComponentModel.DataAnnotations;

namespace GymMasterAPI.Dtos
{
    // El que recibes cuando el administrador crea un nuevo plan en el sistema
    public class CrearMembresiaDto
    {
        [Required]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [Range(0, 10000, ErrorMessage = "El costo debe ser un valor positivo")]
        public decimal Costo { get; set; }

        [Required]
        [Range(1, 365, ErrorMessage = "La duración debe estar entre 1 y 365 días")]
        public int DuracionDias { get; set; }

        public string Descripcion { get; set; } = string.Empty;
    }
}