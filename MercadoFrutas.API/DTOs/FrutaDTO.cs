namespace MercadoFrutas.API.DTOs;

public class CrearFrutaDTO
{
    public string Nombre { get; set; } = string.Empty;
    public bool EnTemporada { get; set; }
    public float StockKg { get; set; }
}