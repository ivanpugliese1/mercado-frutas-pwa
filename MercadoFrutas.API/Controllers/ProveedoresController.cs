using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MercadoFrutas.API.Data;
using MercadoFrutas.API.Models;
using MercadoFrutas.API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace MercadoFrutas.API.Controllers;

[ApiController]
[Route("api/[controller]")] // Define la ruta base para este controller. [controller] es un placeholder que se reemplaza automáticamente por el nombre del controller sin la palabra "Controller". En este caso, la ruta base va a ser "api/proveedores".
[Authorize(Roles = "admin")]
public class ProveedoresController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProveedoresController(AppDbContext context)
    {
        _context = context;
    }

    // GET /api/proveedores
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var proveedores = await _context.Proveedores
            .Select(p => new //  En lugar de devolver el objeto completo, proyectás solo los campos que necesitás. Acá estás calculando el SaldoPendiente directamente en la consulta — la base de datos hace el cálculo, no el servidor.
            {
                p.Id,
                p.Nombre,
                p.Telefono,
                p.CreadoEn,
                TotalIngresos = p.Ingresos.Sum(i => i.CantidadKg * i.PrecioPorKg),
                TotalPagos = p.Pagos.Sum(pg => pg.Monto),
                SaldoPendiente = p.Ingresos.Sum(i => i.CantidadKg * i.PrecioPorKg) - p.Pagos.Sum(pg => pg.Monto)
            })
            .ToListAsync();

        return Ok(proveedores);
    }

        // GET /api/proveedores/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var proveedor = await _context.Proveedores
            .Include(p => p.Ingresos) // Le dice a EF Core que cargue también las relaciones. Sin esto, proveedor.Ingresos vendría vacío aunque haya datos. Se llama eager loading — cargá todo junto en una sola consulta.
            .Include(p => p.Pagos)
            .FirstOrDefaultAsync(p => p.Id == id); //  Trae el primer resultado que coincida o null si no encuentra nada. Lo usamos en lugar de FindAsync cuando necesitamos usar .Include().

        if (proveedor == null) return NotFound();
        return Ok(proveedor);
    }

    // POST /api/proveedores
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Proveedor proveedor)
    {
        _context.Proveedores.Add(proveedor);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = proveedor.Id }, proveedor);
    }
}