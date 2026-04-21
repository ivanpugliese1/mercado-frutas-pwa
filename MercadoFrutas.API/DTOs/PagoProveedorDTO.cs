namespace MercadoFrutas.API.DTOs;

public class PagoProveedorDTO
{
    public int ProveedorId { get; set; }
    public float Monto { get; set; }
    public string MetodoPago { get; set; } = string.Empty; // "efectivo" | "transferencia"
    public string? Notas { get; set; }
}