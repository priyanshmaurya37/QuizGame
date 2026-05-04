using Microsoft.EntityFrameworkCore;
using Quzi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// session
builder.Services.AddSession(
    x=>x.IdleTimeout=TimeSpan.FromSeconds(10)
    );

// Database Connection
builder.Services.AddDbContext<DatabaseConnection>(
    x=>x.UseSqlServer(builder.Configuration.GetConnectionString("myconnection"))
    );

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}
app.UseRouting();

app.UseAuthorization();

app.UseSession();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=StudentMaster}/{action=Index}/{id?}")
    .WithStaticAssets();


app.Run();
