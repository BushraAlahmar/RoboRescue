using FluentValidation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Behaviors;
using RoboRescue.Application.Abstractions.ExternalProviders;
using RoboRescue.Application.Authentication.Dtos;
using RoboRescue.Application.Options;
using RoboRescue.Domain.Users.Services;

namespace RoboRescue.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddMediatR(conf =>
        {
            conf.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly);

            conf.AddOpenBehavior(typeof(LoggingBehavior<,>));

            conf.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly, includeInternalTypes: true);
        services.AddScoped<IPasswordService, PasswordService>();
        services.Configure<JwtOptions>(configuration.GetSection(nameof(JwtOptions)));
        return services;
    }
}