using EFDataAccessLibrary.DataAccess;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
            if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("IS_DOCKER")))
            {
                mySqlConnectionStr = Configuration.GetConnectionString("DefaultConnection");
            }
            else
            {
                mySqlConnectionStr = $"" +
                $"Server={Environment.GetEnvironmentVariable("DB_ADDR")}; " +
                $"Port={Environment.GetEnvironmentVariable("DB_PORT")}; " +
                $"Database={Environment.GetEnvironmentVariable("DB_NAME")}; " +
                $"Uid={Environment.GetEnvironmentVariable("DB_USER")}; " +
                $"Pwd={Environment.GetEnvironmentVariable("DB_PASS")};";
            }

            services.AddDbContext<RecipesContext>(options =>
            {
                options.UseMySql(mySqlConnectionStr, ServerVersion.AutoDetect(mySqlConnectionStr));
            });

            services.AddCors(options =>
            {
                options.AddPolicy("CorsApi",
                    builder => builder.WithOrigins("http://localhost:3000", "http://192.168.0.87:3000")
                .AllowAnyHeader()
                .AllowAnyMethod());
            });

            services.AddSwaggerGen();

            services.AddControllers();
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

            using var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope();
            var context = serviceScope.ServiceProvider.GetRequiredService<RecipesContext>();
            context.Database.Migrate();
        }
    }
}