using api;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Persistent;

namespace Api.Extensions
{
    public static class ScopedExtensions
    {
        public static IServiceCollection AddScopedExtensions(this IServiceCollection services, IConfiguration config)
        {
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .WithExposedHeaders("WWW-Authenticate")
                        .WithOrigins("http://localhost:3000")
                        .AllowCredentials();
                });
            });

            services.AddControllers(opt =>
            {
                AuthorizationPolicy policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            });

            services.AddDbContext<DataContext>(opt =>
                {
                    opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
                }
            );

            services.AddAutoMapper(typeof(Startup));
            return services;
        }
    }
}