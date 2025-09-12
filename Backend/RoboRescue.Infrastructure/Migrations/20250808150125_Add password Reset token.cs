using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RoboRescue.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddpasswordResettoken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PasswordResetToken",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", unicode: false, nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", unicode: false, nullable: false),
                    PasswordToken = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    ExpiredAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: false),
                    IsUsed = table.Column<bool>(type: "bit", unicode: false, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: true),
                    DeletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PasswordResetToken", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PasswordResetToken_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PasswordResetToken_UserId",
                table: "PasswordResetToken",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PasswordResetToken");
        }
    }
}
