namespace GymMasterAPI.Models
{
    public class Membresia
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty; // Ej: Pase Diario, Mensualidad Básica, Anual VIP
        public decimal Costo { get; set; }
        public int DuracionDias { get; set; } // Para calcular automáticamente cuándo vence
        public string Descripcion { get; set; } = string.Empty;
    }
}