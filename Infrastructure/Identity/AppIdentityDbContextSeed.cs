using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;


namespace Infrastructure.Identity
{
    public static class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager)
        {
            if(!userManager.Users.Any())
            {
                var user1 = new AppUser 
                {
                    DisplayName = "Bob",
                    Email = "bob@hotmail.com",
                    UserName = "bob@hotmail.com",
                    Address = new Address
                    {
                        FirstName = "Bob",
                        LastName = "Mayfield",
                        Country = "United States",
                        StreetNumberAndName = "10 Main St",
                        City = "New York",
                        StateOrProvince = "New York",
                        ZipCode = "9021005"
                    }
                };

                var user2 = new AppUser 
                {
                    DisplayName = "Amy",
                    Email = "amy@hotmail.com",
                    UserName = "amy@hotmail.com",
                    Address = new Address
                    {
                        FirstName = "Amy",
                        LastName = "Chesterfield",
                        Country = "United States",
                        StreetNumberAndName = "200 Maple Dr",
                        City = "Harlem",
                        StateOrProvince = "Brooklyn",
                        ZipCode = "8031704"
                    }
                };

                var user3 = new AppUser 
                {
                    DisplayName = "Dan",
                    Email = "dan@hotmail.com",
                    UserName = "dan@hotmail.com",
                    Address = new Address
                    {
                        FirstName = "Daniel",
                        LastName = "Smith",
                        Country = "Canada",
                        StreetNumberAndName = "20 Front St",
                        City = "Toronto",
                        StateOrProvince = "Ontario",
                        ZipCode = "M2V 3P2"
                    }                    
                };
                // create users and add to the database
                await userManager.CreateAsync(user1, "Pa$$w0rd");
                await userManager.CreateAsync(user2, "Pa$$w0rd");
                await userManager.CreateAsync(user3, "Pa$$w0rd");
            }
        }
    }
}