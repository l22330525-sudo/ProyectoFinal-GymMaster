namespace GymMasterAPI.Models
{
    public class Membresia
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public decimal Costo { get; set; }
        public int DuracionDias { get; set; }
        public string Descripcion { get; set; } = string.Empty;
    }
}