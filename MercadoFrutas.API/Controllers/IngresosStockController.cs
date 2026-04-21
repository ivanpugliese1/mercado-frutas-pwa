using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MercadoFrutas.API.Data;
using MercadoFrutas.API.Models;
using MercadoFrutas.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using MercadoFrutas.API.Services;

namespace MercadoFrutas.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class IngresosStockController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly AuditoriaService _auditoria;

    public IngresosStockController(AppDbContext context, AuditoriaService auditoria)
    {
        _context = context;
        _auditoria = auditoria;

    }

    // GET /api/ingresosstock
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var ingresos = await _context.IngresosStock
            .Include(i => i.Fruta)
            .Include(i => i.Proveedor)
            .OrderByDescending(i => i.Fecha)
            .ToListAsync();

        return Ok(ingresos);
    }

     // POST /api/ingresosstock
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] IngresoStockDTO dto)
    {
        var fruta = await _context.Frutas.FindAsync(dto.FrutaId);
        if (fruta == null) return NotFound("Fruta no encontrada");

        var proveedor = await _context.Proveedores.FindAsync(dto.ProveedorId);
        if (proveedor == null) return NotFound("Proveedor no encontrado");

        var ingreso = new IngresoStock
        {
            FrutaId = dto.FrutaId,
            ProveedorId = dto.ProveedorId,
            CantidadKg = dto.CantidadKg,
            PrecioPorKg = dto.PrecioPorKg,
            Notas = dto.Notas,
            Fecha = DateTime.UtcNow
        };

        // Actualizar el stock de la fruta
        fruta.StockKg += dto.CantidadKg;

        _context.IngresosStock.Add(ingreso);
        await _context.SaveChangesAsync();

        await _auditoria.RegistrarAsync(
        "CREATE",
        "IngresoStock",
        $"Ingreso de {dto.CantidadKg}kg de {fruta.Nombre} de {proveedor.Nombre} a ${dto.PrecioPorKg}/kg");

        return CreatedAtAction(nameof(GetAll), new { id = ingreso.Id }, ingreso);
    }
}  