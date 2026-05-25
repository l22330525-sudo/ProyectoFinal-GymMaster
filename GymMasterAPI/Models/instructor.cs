namespace GymMasterAPI.Models
{
    public class Instructor
    {
        public int Id { get; set; }
        public string NombreCompleto { get; set; } = string.Empty;
        public string Especialidad { get; set; } = string.Empty; // Ej: Pesas, Zumba, Crossfit
        public string Turno { get; set; } = string.Empty; // Matutino, Vespertino
        public bool EstaActivo { get; set; } = true;
    }
}