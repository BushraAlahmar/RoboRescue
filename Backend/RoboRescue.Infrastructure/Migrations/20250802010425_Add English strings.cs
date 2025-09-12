using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RoboRescue.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEnglishstrings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EnDescription",
                table: "Section",
                type: "varchar(max)",
                unicode: false,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EnName",
                table: "Section",
                type: "varchar(max)",
                unicode: false,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EnDescription",
                table: "Level",
                type: "varchar(max)",
                unicode: false,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EnName",
                table: "Level",
                type: "varchar(max)",
                unicode: false,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EnSuccessMessage",
                table: "Level",
                type: "varchar(max)",
                unicode: false,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EnTask",
                table: "Level",
                type: "varchar(max)",
                unicode: false,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EnDescription",
                table: "Section");

            migrationBuilder.DropColumn(
                name: "EnName",
                table: "Section");

            migrationBuilder.DropColumn(
                name: "EnDescription",
                table: "Level");

            migrationBuilder.DropColumn(
                name: "EnName",
                table: "Level");

            migrationBuilder.DropColumn(
                name: "EnSuccessMessage",
                table: "Level");

            migrationBuilder.DropColumn(
                name: "EnTask",
                table: "Level");
        }
    }
}
