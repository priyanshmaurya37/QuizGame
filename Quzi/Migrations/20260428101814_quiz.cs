using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Quzi.Migrations
{
    /// <inheritdoc />
    public partial class quiz : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Quzi_Add_Q",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Question_Text = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Option_A = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Option_B = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Option_C = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Option_D = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Correct_Answer = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Target_Class = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Solution_Explanation = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quzi_Add_Q", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Quzi_Add_Q");
        }
    }
}
