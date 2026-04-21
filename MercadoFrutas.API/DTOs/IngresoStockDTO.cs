namespace MercadoFrutas.API.DTOs;

public class IngresoStockDTO
{
    public int FrutaId { get; set; }
    public int ProveedorId { get; set; }
    public float CantidadKg { get; set; }
    public float PrecioPorKg { get; set; }
    public string? Notas { get; set; }
}