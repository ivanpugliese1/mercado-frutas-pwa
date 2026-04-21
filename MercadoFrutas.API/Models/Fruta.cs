namespace MercadoFrutas.API.Models
{
    public class Fruta
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty; //  Valor por defecto para evitar que el compilador se queje de que la propiedad podría ser null. C# moderno es estricto con esto.
        public decimal Precio { get; set; }
        public bool EnTemporada { get; set; }
        public float StockKg { get; set; }
        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;
    }
}