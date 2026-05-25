namespace GymMasterAPI.Dtos
{
    public class MiembroDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime FechaInscripcion { get; set; }
        public bool EstaActivo { get; set; }
        public string? MembresiaNombre { get; set; } // Solo mostramos el nombre del plan contratado
    }
}