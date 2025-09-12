using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.ExternalProviders;
using RoboRescue.Application.Abstractions.JavaCodeAnalyzer;
using RoboRescue.Application.Abstractions.JWT;
using RoboRescue.Application.Authentication.Dtos;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Infrastructure.JavaCodeAnalyzers;
using RoboRescue.Infrastructure.JWT;
using RoboRescue.Infrastructure.Mail;
using RoboRescue.Infrastructure.Notification;
using RoboRescue.Infrastructure.Repositories;

namespace RoboRescue.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("RemoteSQLConnectionString") ??
                               throw new ArgumentNullException(nameof(configuration));
        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseSqlServer(connectionString);
            options.AddInterceptors(new UpdatedAtSetter());
        });
        services.Configure<MailSettings>(configuration.GetSection("MailSettings"));
        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<ApplicationDbContext>());
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IJWTGenerator, JwtGenerator>();
        services.AddScoped<IJwtExtractor, JwtExtractor>();
        services.AddScoped<IGenerateRefreshToken, GenerateRefreshToken>();
        services.AddScoped<IMailSender, MailSender>();
        services.AddScoped<IJavaCodeAnalyzer, JavaCodeAnalyzer>();
        services.AddScoped<IFcm, Fcm>();
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opts =>
        {
            opts.TokenValidationParameters = new TokenValidationParameters()
            {
                ValidateIssuer = true,
                ValidateAudience = false,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidAlgorithms = [SecurityAlgorithms.HmacSha512],
                ValidIssuer = configuration["JwtOptions:Issuer"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtOptions:Key"]!)),
                ClockSkew = TimeSpan.Zero
            };
        });
        services.AddAuthorization();

        return services;
    }
}