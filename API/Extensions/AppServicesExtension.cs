using API.Errors;
using Core.Interfaces;
using Infrastructure.AppDb;
using Infrastructure.Repositories;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

namespace API.Extensions;

public static class AppServicesExtension
{
    public static IServiceCollection AddAppServices(
        this IServiceCollection services,
        IConfiguration config)
    {
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        services.AddSingleton<ICacheService, CacheService>();

        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IBasketRepository, BasketRepository>();
        services.AddScoped<IPaymentService, PaymentService>();

        services.Configure<ApiBehaviorOptions>(config =>
        {
            config.InvalidModelStateResponseFactory = actionContext =>
            {
                var errors = actionContext.ModelState
                    .Where(e => e.Value.Errors.Count > 0)
                    .SelectMany(x => x.Value.Errors)
                    .Select(x => x.ErrorMessage)
                    .ToArray();

                var errorResponse = new ApiValidationErrorResponse
                { Errors = errors };

                return new BadRequestObjectResult(errorResponse);
            };
        });

        services.AddSingleton<IConnectionMultiplexer>(_ =>
        {
            var options = ConfigurationOptions
                .Parse(config.GetConnectionString("RedisConnection"));

            return ConnectionMultiplexer.Connect(options);
        });

        services.AddDbContext<AppDbContext>(opt =>
        {
            // opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            opt.UseNpgsql(config.GetConnectionString("DefaultConnection"));
        });

        services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy", policy =>
            {
                policy
                .AllowAnyHeader()
                .AllowAnyMethod()
                .WithOrigins("https://localhost:4200");
            });
        });

        return services;
    }
}
