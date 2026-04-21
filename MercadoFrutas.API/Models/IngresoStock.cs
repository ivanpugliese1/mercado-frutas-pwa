namespace MercadoFrutas.API.Models
{
    public class IngresoStock
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; } = DateTime.UtcNow;
        public float CantidadKg { get; set;}
        public float PrecioPorKg {get;set;}
        public string? Notas { get; set;}

        // Claves foráneas
        public int FrutaId { get; set; }
        public int ProveedorId { get; set; }

        // Propiedades de navegación
        public Fruta Fruta { get; set; } = null!; // El null! le dice al compilador "confía en mí, esto no va a ser null en tiempo de ejecución". Es necesario porque estas propiedades se llenan automáticamente por Entity Framework cuando haces consultas que incluyen relaciones, pero el compilador no puede saber eso.
        public Proveedor Proveedor { get; set; } = null!; // Lo mismo que arriba.
    }
}