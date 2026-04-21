namespace MercadoFrutas.API.Models
{
    public class PagoProveedor
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; } = DateTime.UtcNow;
        public float Monto { get; set; }
        public string MetodoPago { get; set; } = string.Empty;
        public string? Notas { get; set; }

        // Clave foránea
        public int ProveedorId { get; set; }

        // Propiedad de navegación
        public Proveedor Proveedor { get; set; } = null!; 

        // El saldo pendiente de un proveedor no va a ser una columna en la base de datos — se va a calcular restando el total de pagos al total de ingresos. Eso es importante: no duplicamos datos, calculamos cuando se necesita.
    }
}