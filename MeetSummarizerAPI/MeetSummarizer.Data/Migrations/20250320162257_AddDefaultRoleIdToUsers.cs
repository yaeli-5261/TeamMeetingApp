using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeetSummarizer.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDefaultRoleIdToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
             name: "RoleId",
             table: "Users",
             nullable: false,
             defaultValue: 21
         );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
