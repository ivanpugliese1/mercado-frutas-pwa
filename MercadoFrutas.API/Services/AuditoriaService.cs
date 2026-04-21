using MercadoFrutas.API.Data;
using MercadoFrutas.API.Models;

namespace MercadoFrutas.API.Services;

public class AuditoriaService
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuditoriaService(AppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task RegistrarAsync(string accion, string entidad, string? detalle = null)
    {
        var usuario = _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "anonimo";
        var ip = _httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? "desconocida";

        var log = new AuditoriaLog
        {
            Usuario = usuario,
            Accion = accion,
            Entidad = entidad,
            Detalle = detalle,
            FechaHora = DateTime.UtcNow,
            IpAddress = ip
        };

        _context.AuditoriaLogs.Add(log);
        await _context.SaveChangesAsync();
    }
}