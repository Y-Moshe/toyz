using System.Reflection;
using Core.Entities;
using Core.Entities.Order;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.AppDb;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Brand> Brands { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<DeliveryMethod> DeliveryMethods { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        if (Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
        {
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                var properties = entityType.ClrType
                  .GetProperties()
                  .Where(p => p.PropertyType == typeof(decimal));

                foreach (var property in properties)
                {
                    builder
                      .Entity(entityType.Name)
                      .Property(property.Name)
                      .HasConversion<double>();
                }
            }
        }
    }
}
