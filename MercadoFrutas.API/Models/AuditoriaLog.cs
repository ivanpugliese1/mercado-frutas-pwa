namespace MercadoFrutas.API.Models;

public class AuditoriaLog
{
    public int Id { get; set; }
    public string Usuario { get; set; } = string.Empty;
    public string Accion { get; set; } = string.Empty;
    public string Entidad { get; set; } = string.Empty;
    public string? Detalle { get; set; }
    public DateTime FechaHora { get; set; } = DateTime.UtcNow;
    public string? IpAddress { get; set; }
}