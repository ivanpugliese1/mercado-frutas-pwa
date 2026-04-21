using Microsoft.EntityFrameworkCore; // Importa namespaces externos que esta clase necesita. Es el equivalente al import de TypeScript.
using MercadoFrutas.API.Models;

namespace MercadoFrutas.API.Data;

public class AppDbContext : DbContext // Significa que AppDbContext hereda de DbContext. La herencia en C# funciona con : Al heredar, tu clase obtiene toda la funcionalidad de EF Core automáticamente.
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) // Recibe la configuración de conexión (host, puerto, nombre de base de datos, credenciales) y se la pasa a la clase padre DbContext. Esa configuración la vamos a definir en el siguiente paso.
    {
    }

    public DbSet<Fruta> Frutas { get; set; }
    public DbSet<Proveedor> Proveedores { get; set; }
    public DbSet<IngresoStock> IngresosStock { get; set; }
    public DbSet<PagoProveedor> PagosProveedores { get; set; }
    public DbSet<Venta> Ventas { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<AuditoriaLog> AuditoriaLogs { get; set; }
}

// ¿ Que es el DbContext? 
// El DbContext es la clase principal que coordina la funcionalidad de Entity Framework Core. 
// Actúa como un intermediario entre tu aplicación y la base de datos, permitiendo realizar operaciones de lectura, escritura y eliminación de datos.

