namespace MercadoFrutas.API.Models
{
    public class Venta
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; } = DateTime.UtcNow;
        public float CantidadKg { get; set; }
        public float PrecioPorKg { get; set; }
        public string TipoVenta { get; set; } = string.Empty; // "Al por mayor" o "Al por menor"
        public string? Notas { get; set; }

        // Clave foránea
        public int FrutaId { get; set; }

        // Propiedad de navegación
        public Fruta Fruta { get; set; } = null!; // Lo mismo que en los otros modelos: le decimos al compilador que confiamos en que esta propiedad no va a ser null en tiempo de ejecución, aunque no le estemos asignando un valor aquí. 

        // El PrecioPorKg lo guardamos directamente en la venta en lugar de referenciarlo de una tabla de precios. ¿Por qué?
        // Porque el precio puede cambiar mañana, y necesitás saber a qué precio se vendió ese día específico. Si solo guardaras una referencia al precio actual, perderías el historial. Al guardarlo en la venta, cada registro es inmutable e independiente.
    }
}