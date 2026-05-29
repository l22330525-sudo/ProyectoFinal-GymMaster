using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GymMasterAPI.Migrations
{
    /// <inheritdoc />
    public partial class agregarModulos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Modulos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Badge = table.Column<string>(type: "nvarchar(4)", maxLength: 4, nullable: false),
                    Color = table.Column<string>(type: "nvarchar(9)", maxLength: 9, nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    InstructorId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Modulos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Modulos_Instructores_InstructorId",
                        column: x => x.InstructorId,
                        principalTable: "Instructores",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "HorariosModulo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ModuloId = table.Column<int>(type: "int", nullable: false),
                    DiaSemana = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    HoraInicio = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    HoraFin = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    Nivel = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HorariosModulo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HorariosModulo_Modulos_ModuloId",
                        column: x => x.ModuloId,
                        principalTable: "Modulos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Modulos",
                columns: new[] { "Id", "Activo", "Badge", "Color", "Descripcion", "InstructorId", "Nombre" },
                values: new object[,]
                {
                    { 1, true, "BX", "#aa3bff", "Aprende técnicas de defensa personal, mejora tu condición física y libera el estrés.", 1, "Boxeo" },
                    { 2, true, "ZB", "#ff3b9a", "Baila, quema calorías y diviértete con ritmos latinos. Clases para todos los niveles.", 2, "Zumba" }
                });

            migrationBuilder.InsertData(
                table: "HorariosModulo",
                columns: new[] { "Id", "DiaSemana", "HoraFin", "HoraInicio", "ModuloId", "Nivel" },
                values: new object[,]
                {
                    { 1, "Lunes", "08:30", "07:00", 1, "Principiante" },
                    { 2, "Miércoles", "08:30", "07:00", 1, "Principiante" },
                    { 3, "Viernes", "09:30", "08:00", 1, "Avanzado" },
                    { 4, "Sábado", "11:00", "09:00", 1, "Todos los niveles" },
                    { 5, "Martes", "08:00", "07:00", 2, "Todos los niveles" },
                    { 6, "Jueves", "18:00", "17:00", 2, "Principiante" },
                    { 7, "Miércoles", "20:00", "19:00", 2, "Intermedio" },
                    { 8, "Sábado", "11:30", "10:00", 2, "Todos los niveles" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_HorariosModulo_ModuloId",
                table: "HorariosModulo",
                column: "ModuloId");

            migrationBuilder.CreateIndex(
                name: "IX_Modulos_InstructorId",
                table: "Modulos",
                column: "InstructorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HorariosModulo");

            migrationBuilder.DropTable(
                name: "Modulos");
        }
    }
}
