namespace GymMasterAPI.Dtos
{
    public class InstructorDto
    {
        public int Id { get; set; }
        public string NombreCompleto { get; set; } = string.Empty;
        public string Especialidad { get; set; } = string.Empty;
        public string Turno { get; set; } = string.Empty;
        public bool EstaActivo { get; set; }
    }
}