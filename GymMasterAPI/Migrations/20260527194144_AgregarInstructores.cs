using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GymMasterAPI.Migrations
{
    /// <inheritdoc />
    public partial class AgregarInstructores : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Instructores",
                columns: new[] { "Id", "Especialidad", "EstaActivo", "NombreCompleto", "Turno" },
                values: new object[,]
                {
                    { 1, "Boxeo", true, "Carlos Cordova", "Matutino y Vespertino" },
                    { 2, "Zumba y ritmos latinos", true, "Valeria Ríos", "Matutino y Vespertino" }
                });

            migrationBuilder.InsertData(
                table: "Membresias",
                columns: new[] { "Id", "Costo", "Descripcion", "DuracionDias", "Nombre" },
                values: new object[,]
                {
                    { 1, 50m, "Acceso completo al gimnasio por un día. Ideal para visitantes o prueba.", 1, "Plan Diario" },
                    { 2, 200m, "Una semana completa de entrenamiento sin restricciones.", 7, "Plan Semanal" },
                    { 3, 600m, "Un mes entero con acceso completo. La mejor opción para resultados reales.", 30, "Plan Mensual" },
                    { 4, 150m, "Acceso diario al gimnasio más un módulo de Boxeo o Zumba a tu elección.", 1, "Diario + Módulo" },
                    { 5, 300m, "Una semana con acceso al gimnasio y clases de Boxeo o Zumba incluidas.", 7, "Semanal + Módulo" },
                    { 6, 700m, "El plan más completo. Un mes con gimnasio y clases de Boxeo o Zumba.", 30, "Mensual + Módulo" }
                });

            migrationBuilder.InsertData(
                table: "Miembros",
                columns: new[] { "Id", "Email", "EstaActivo", "FechaInscripcion", "MembresiaId", "Nombre", "Password", "Rol" },
                values: new object[,]
                {
                    { 1, "admin@gym.com", true, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Administrador", "admin123", "Admin" },
                    { 2, "recepcion@gym.com", true, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Recepción Principal", "recepcion123", "Recepcionista" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Instructores",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Instructores",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Membresias",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Membresias",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Membresias",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Membresias",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Membresias",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Membresias",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Miembros",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Miembros",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
