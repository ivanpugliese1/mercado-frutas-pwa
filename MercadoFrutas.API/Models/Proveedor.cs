namespace MercadoFrutas.API.Models 
{
    public class Proveedor
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Dirección { get; set; } = string.Empty;
        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

        // Un Proveedor puede tener muchos ingresos de stock y muchos pagos. Estas propiedades le dicen eso a Entity Framework — son lo que se llama propiedades de navegación.
        public ICollection<IngresoStock> Ingresos {get; set;} = new List<IngresoStock>();
        public ICollection<PagoProveedor> Pagos { get; set; } = new List<PagoProveedor>(); 
    }
}