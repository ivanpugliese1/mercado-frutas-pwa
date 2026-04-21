namespace MercadoFrutas.API.DTOs;

public class VentaDTO
{
    public int FrutaId { get; set; }
    public float CantidadKg { get; set; }
    public float PrecioPorKg { get; set; }
    public string TipoVenta { get; set; } = string.Empty; // "mayorista" | "minorista"
    public string? Notas { get; set; }
}