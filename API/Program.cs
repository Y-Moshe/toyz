using API.Extensions;
using API.Middlewares;
using Core.Entities.Identity;
using Infrastructure.AppDb;
using Infrastructure.AppIdentity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddAppServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddSwaggerDocumentation();

var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();
app.UseStatusCodePagesWithReExecute("/Errors/{0}");

app.UseSwaggerDocumentation();

// app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseCors("CorsPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToController("Index", "Fallback");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
var context = services.GetRequiredService<AppDbContext>();
var identityContext = services.GetRequiredService<AppIdentityDbContext>();
var userManager = services.GetRequiredService<UserManager<AppUser>>();
var logger = services.GetRequiredService<ILogger<Program>>();

try
{
  await context.Database.MigrateAsync();
  await identityContext.Database.MigrateAsync();
  await AppDbContextSeed.SeedAsync(context);
  await AppIdentityDbContextSeed.SeedUserAsync(userManager);
}
catch (Exception ex)
{
  logger.LogError(ex, "An error occured during migration!");
}

app.Run();
