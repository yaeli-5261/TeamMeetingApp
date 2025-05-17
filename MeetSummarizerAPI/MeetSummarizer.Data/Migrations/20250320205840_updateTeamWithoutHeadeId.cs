using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeetSummarizer.Data.Migrations
{
    /// <inheritdoc />
    public partial class updateTeamWithoutHeadeId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HeaderTeamId",
                table: "Teams");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HeaderTeamId",
                table: "Teams",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
