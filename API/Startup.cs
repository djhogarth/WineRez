using API.Helpers;
using API.Middleware;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using API.Extensions;
using StackExchange.Redis;
using Infrastructure.Identiity;

namespace API
{
    public class Startup
    {
        private readonly IConfiguration _config;
        public Startup(IConfiguration config)
        {
            _config = config;

        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAutoMapper(typeof(MappingProfiles));

            services.AddControllers();
            //Add a service for the store's DbContext
            services.AddDbContext<StoreContext>(x =>
                x.UseSqlite(_config.GetConnectionString("DefaultConnection")));

            //Add a service for the Identity DbContext
            services.AddDbContext<AppIdentityDbContext>( x=>
            {
                x.UseSqlite(_config.GetConnectionString("IdentityConnection"));
            });

            //Add a service for Redis
            services.AddSingleton<IConnectionMultiplexer>(c => 
            {
               var configuration = ConfigurationOptions.Parse(_config.GetConnectionString("Redis"), true);
               return ConnectionMultiplexer.Connect(configuration);
            });
            services.AddApplicationServices();
            services.AddIdentityServices();
            services.AddSwaggerDocumentation();            
            services.AddCors(opt =>
            {
                opt.AddPolicy("Cors Policy", policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200");
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwaggerDocumentation();
            }
            app.UseMiddleware<ExceptionMiddleware>();

            app.UseStatusCodePagesWithReExecute("/errors/{0}");

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseStaticFiles();

            app.UseCors("Cors Policy");
            
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
