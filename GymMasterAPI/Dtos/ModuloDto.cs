namespace GymMasterAPI.Dtos
{
    public class ModuloDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string Badge { get; set; } = "MD";
        public string Color { get; set; } = "#aa3bff";
        public bool Activo { get; set; } = true;
        public int? InstructorId { get; set; }
        public string? InstructorNombre { get; set; }
        public List<HorarioModuloDto> Horarios { get; set; } = new();
    }

    public class HorarioModuloDto
    {
        public int Id { get; set; }
        public string DiaSemana { get; set; } = string.Empty;
        public string HoraInicio { get; set; } = string.Empty;
        public string HoraFin { get; set; } = string.Empty;
        public string Nivel { get; set; } = "Todos los niveles";
    }
}
