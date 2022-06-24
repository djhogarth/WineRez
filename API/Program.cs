using Domain.Entities.Identity;
using Infrastructure.Data;
using Infrastructure.Data.SeedData;
using Infrastructure.Identiity;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var loggerFactory = services.GetRequiredService<ILoggerFactory>();
                try 
                {
                    //getting the service handling the store's DbContext
                    var context = services.GetRequiredService<StoreContext>();
                     // Create the store database and add the seed data
                    await context.Database.MigrateAsync();
                    await StoreContextSeed.SeedAsync(context, loggerFactory);

                    //getting the UserManger service
                    var userManager = services.GetRequiredService<UserManager<AppUser>>();
                    //get the service for the AppIdentityDbContext
                    var identityContext = services.GetRequiredService<AppIdentityDbContext>();
                    // Create the identity database and add the seed data
                    await identityContext.Database.MigrateAsync();
                    await AppIdentityDbContextSeed.SeedUsersAsync(userManager);
                }
                catch (Exception ex)
                {
                    var logger = loggerFactory.CreateLogger<Program>();
                    logger.LogError(ex, "An error occured during the migration");
                }
            }

             host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
