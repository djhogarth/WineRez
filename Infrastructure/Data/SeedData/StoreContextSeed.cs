using System.Reflection;
using System.Text.Json;
using Domain.Entities;
using Domain.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.SeedData
{
    public class StoreContextSeed
    {
        public static async Task SeedAsync(StoreContext context, ILoggerFactory loggerFactory)
        {
            try
            {
                var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

                // Insert product brands seed data
                if (!context.ProductBrands.Any())
                {
                    using var transaction = context.Database.BeginTransaction();
                    var brandsData = File.ReadAllText(path + @"/Data/SeedData/brands.json");

                    var brands = JsonSerializer.Deserialize<List<ProductBrand>>(brandsData);

                    foreach (var item in brands)
                    {
                        context.ProductBrands.Add(item);
                    }

                    context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT ProductBrands ON");

                    await context.SaveChangesAsync();

                    context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT ProductBrands OFF");

                    transaction.Commit();

                }

                // Insert product types seed data
                if (!context.ProductTypes.Any())
                {
                    using var transaction = context.Database.BeginTransaction();
                    var typesData = File.ReadAllText(path + @"/Data/SeedData/types.json");

                    var types = JsonSerializer.Deserialize<List<ProductType>>(typesData);

                    foreach (var item in types)
                    {
                        context.ProductTypes.Add(item);
                    }

                    context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT ProductTypes ON");
                    await context.SaveChangesAsync();
                    context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT ProductTypes OFF");

                    transaction.Commit();

                }

                // Insert products seed data
                if (!context.Products.Any())
                {
                    var productsData = File.ReadAllText(path + @"/Data/SeedData/products.json");

                    var products = JsonSerializer.Deserialize<List<Product>>(productsData);

                    foreach (var item in products)
                    {
                        context.Products.Add(item);
                    }

                    await context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT Products ON");
                    await context.SaveChangesAsync();
                    await context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT Products OFF");
                    

                }
                // Insert delivery methods seed data
                if (!context.DeliveryMethods.Any())
                {
                    using var transaction = context.Database.BeginTransaction();
                    var deliveryMethodData = File.ReadAllText(path + @"/Data/SeedData/delivery.json");

                    var methods = JsonSerializer.Deserialize<List<DeliveryMethod>>(deliveryMethodData);

                    foreach (var method in methods)
                    {
                        context.DeliveryMethods.Add(method);
                    }
                    
                    context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT DeliveryMethods ON");
                    await context.SaveChangesAsync();
                    context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT DeliveryMethods OFF");

                    transaction.Commit();
                }
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<StoreContextSeed>();
                logger.LogError(ex.Message);
            }

        }
    }
}