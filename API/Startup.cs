using API.Helpers;
using API.Helpers.Interfaces;
using EFDataAccessLibrary.DataAccess;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            string mySqlConnectionStr;
            // Used for migrations in dev
            if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("IS_DOCKER")))
            {
                mySqlConnectionStr = Configuration.GetConnectionString("DefaultConnection");

                services.AddSingleton<IBackupHelper, BackupHelper>(op =>
                {
                    return new BackupHelper(string.Empty, string.Empty);
                });
            }
            else
            {
                var dbName = Environment.GetEnvironmentVariable("DB_NAME");
                var dbPass = Environment.GetEnvironmentVariable("DB_PASS");

                mySqlConnectionStr = $"" +
                $"Server={Environment.GetEnvironmentVariable("DB_ADDR")}; " +
                $"Port={Environment.GetEnvironmentVariable("DB_PORT")}; " +
                $"Database={dbName}; " +
                $"Uid={Environment.GetEnvironmentVariable("DB_USER")}; " +
                $"Pwd={dbPass};";

                // https://www.thecodebuzz.com/initialize-instances-within-configservices-in-startup/
                services.AddSingleton<IBackupHelper, BackupHelper>(op =>
                {
                    return new BackupHelper(dbName, dbPass);
                });
            }

            services.AddDbContext<RecipesContext>(options =>
            {
                options.UseMySql(mySqlConnectionStr, ServerVersion.AutoDetect(mySqlConnectionStr));
            });

            services.AddCors(options =>
            {
                options.AddPolicy("CorsApi", builder => 
                    builder.WithOrigins(Environment.GetEnvironmentVariable("WEB_APP_ADDR") ?? "localhost")
                           .AllowAnyHeader()
                           .AllowAnyMethod());
            });

            services.AddSwaggerGen();
            services.AddControllers().AddNewtonsoftJson();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1"));
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseCors("CorsApi");

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            // Autorun migrations
            using var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope();
            var context = serviceScope.ServiceProvider.GetRequiredService<RecipesContext>();
            context.Database.Migrate();
        }
    }
}