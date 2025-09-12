using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RoboRescue.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CodeAnalyzer",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", unicode: false, nullable: false),
                    ClassCount = table.Column<int>(type: "int", unicode: false, nullable: false),
                    InterfaceCount = table.Column<int>(type: "int", unicode: false, nullable: false),
                    HasInheritance = table.Column<bool>(type: "bit", unicode: false, nullable: false),
                    HasInterfaceImplementation = table.Column<bool>(type: "bit", unicode: false, nullable: false),
                    HasEncapsulation = table.Column<bool>(type: "bit", unicode: false, nullable: false),
                    HasPrivateMembers = table.Column<bool>(type: "bit", unicode: false, nullable: false),
                    HasProtectedMembers = table.Column<bool>(type: "bit", unicode: false, nullable: false),
                    HasAbstractClass = table.Column<bool>(type: "bit", unicode: false, nullable: false),
                    HasAbstractMethods = table.Column<bool>(type: "bit", unicode: false, nullable: false),
                    HasPolymorphism = table.Column<bool>(type: "bit", unicode: false, nullable: false),
                    HasComposition = table.Column<bool>(type: "bit", unicode: false, nullable: false),
                    HasMethodOverloading = table.Column<bool>(type: "bit", unicode: false, nullable: false),
                    HasConstructorOverloading = table.Column<bool>(type: "bit", unicode: false, nullable: false),
                    HasStaticMembers = table.Column<bool>(type: "bit", unicode: false, nullable: false),
                    HasFinalMembers = table.Column<bool>(type: "bit", unicode: false, nullable: false),
                    HasGenerics = table.Column<bool>(type: "bit", unicode: false, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: true),
                    DeletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CodeAnalyzer", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Section",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", unicode: false, nullable: false),
                    Name = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    SectionNumber = table.Column<int>(type: "int", unicode: false, nullable: false),
                    Description = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: true),
                    DeletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Section", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", unicode: false, nullable: false),
                    FirstName = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    LastName = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    BirthDate = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: false),
                    UserName = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Password = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Email = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    FcmToken = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    IsActive = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: true),
                    DeletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Level",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", unicode: false, nullable: false),
                    Name = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    LevelNumber = table.Column<int>(type: "int", unicode: false, nullable: false),
                    SectionId = table.Column<Guid>(type: "uniqueidentifier", unicode: false, nullable: false),
                    CodeAnalyzerId = table.Column<Guid>(type: "uniqueidentifier", unicode: false, nullable: false),
                    Description = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Task = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    SuccessMessage = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    DependentOnLevelId = table.Column<Guid>(type: "uniqueidentifier", unicode: false, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: true),
                    DeletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Level", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Level_CodeAnalyzer_CodeAnalyzerId",
                        column: x => x.CodeAnalyzerId,
                        principalTable: "CodeAnalyzer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Level_Level_DependentOnLevelId",
                        column: x => x.DependentOnLevelId,
                        principalTable: "Level",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Level_Section_SectionId",
                        column: x => x.SectionId,
                        principalTable: "Section",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EmailToken",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", unicode: false, nullable: false),
                    Token = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Email = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    IsUsed = table.Column<bool>(type: "bit", unicode: false, nullable: false),
                    ExpiredAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", unicode: false, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: true),
                    DeletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailToken", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmailToken_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RefreshToken",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", unicode: false, nullable: false),
                    Token = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Expired = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: false),
                    UserSecurityHash = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    IsUsed = table.Column<bool>(type: "bit", unicode: false, nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", unicode: false, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: true),
                    DeletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshToken", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RefreshToken_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserLevel",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", unicode: false, nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", unicode: false, nullable: false),
                    LevelId = table.Column<Guid>(type: "uniqueidentifier", unicode: false, nullable: false),
                    Code = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: true),
                    DeletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", unicode: false, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLevel", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserLevel_Level_LevelId",
                        column: x => x.LevelId,
                        principalTable: "Level",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserLevel_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EmailToken_UserId",
                table: "EmailToken",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Level_CodeAnalyzerId",
                table: "Level",
                column: "CodeAnalyzerId");

            migrationBuilder.CreateIndex(
                name: "IX_Level_DependentOnLevelId",
                table: "Level",
                column: "DependentOnLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_Level_SectionId",
                table: "Level",
                column: "SectionId");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshToken_UserId",
                table: "RefreshToken",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLevel_LevelId",
                table: "UserLevel",
                column: "LevelId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLevel_UserId",
                table: "UserLevel",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmailToken");

            migrationBuilder.DropTable(
                name: "RefreshToken");

            migrationBuilder.DropTable(
                name: "UserLevel");

            migrationBuilder.DropTable(
                name: "Level");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "CodeAnalyzer");

            migrationBuilder.DropTable(
                name: "Section");
        }
    }
}
