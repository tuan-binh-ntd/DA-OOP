using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class AddReasonForDelayColunmToDB : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ReasonForDelay",
                table: "Task",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReasonForDelay",
                table: "Task");
        }
    }
}
