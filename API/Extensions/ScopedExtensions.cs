using api;
using API.Services;
using Application;
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
            services.AddScoped<TokenServices>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<INqfLevelService, NqfLevelService>();
            services.AddScoped<IQualificationService, QualificationService>();
            services.AddScoped<IModuleService, ModuleService>();
            services.AddScoped<IActivityService, ActivityService>();
            services.AddScoped<ICampusService, CampusService>();
            services.AddScoped<IProfileDocumentTypeService, ProfileDocumentTypeService>();
            services.AddScoped<IProfileDocumentService, ProfileDocumentService>();
            services.AddScoped<IFileServices, FileServices>();
            services.AddAutoMapper(typeof(Startup));
            return services;
        }
    }
}