using System.Text;
using Core.Entities.Identity;
using Core.Interfaces;
using Infrastructure.AppIdentity;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions;

public static class IdentityServicesExtension
{
    public static void AddIdentityServices(
        this IServiceCollection services,
        IConfiguration config)
    {
        services.AddScoped<IAccountService, AccountService>();
        services.AddDbContext<AppIdentityDbContext>(options =>
        {
            // options.UseSqlite(config.GetConnectionString("IdentityConnection"));
            options.UseNpgsql(config.GetConnectionString("IdentityConnection"));
        });

        services.AddIdentityCore<AppUser>(options =>
        {
            // Add identity options
            options.Lockout.AllowedForNewUsers = true;
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(1);
            options.Lockout.MaxFailedAccessAttempts = config.GetValue<int>("LoginAttempts");

            // Password validation
            options.Password.RequireDigit = true;
            options.Password.RequiredLength = 6;
            options.Password.RequiredUniqueChars = 0;
            options.Password.RequireLowercase = true;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = true;
        })
        .AddEntityFrameworkStores<AppIdentityDbContext>()
        .AddSignInManager<SignInManager<AppUser>>();

        services
          .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
          .AddJwtBearer(options =>
          {
              options.TokenValidationParameters = new TokenValidationParameters
              {
                  ValidateIssuerSigningKey = true,
                  IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Token:Key"])),
                  ValidateIssuer = true,
                  ValidIssuer = config["Token:Issuer"],
                  ValidateAudience = false
              };
          });

        services.AddAuthorization();
    }
}
