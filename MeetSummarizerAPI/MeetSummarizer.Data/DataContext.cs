using MeetSummarizer.Core.Entities;
using Microsoft.EntityFrameworkCore;

public class DataContext : DbContext 
{
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Meeting> Meetings { get; set; }
    public DbSet<Team> Teams { get; set; }


    public DataContext(DbContextOptions<DataContext> options) : base(options) { }
}