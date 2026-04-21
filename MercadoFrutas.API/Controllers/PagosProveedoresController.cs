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
[Authorize(Roles = "admin")]
public class PagosProveedoresController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly AuditoriaService _auditoria;

    public PagosProveedoresController(AppDbContext context, AuditoriaService auditoria)
    {
        _context = context;
        _auditoria = auditoria;
    }

    // GET /api/pagosproveedores
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var pagos = await _context.PagosProveedores
            .Include(p => p.Proveedor)
            .OrderByDescending(p => p.Fecha)
            .ToListAsync();

        return Ok(pagos);
    }

    // GET /api/pagosproveedores/proveedor/1
    [HttpGet("proveedor/{proveedorId}")]
    public async Task<IActionResult> GetByProveedor(int proveedorId)
    {
        var proveedor = await _context.Proveedores
            .Include(p => p.Ingresos)
            .Include(p => p.Pagos)
            .FirstOrDefaultAsync(p => p.Id == proveedorId);

        if (proveedor == null) return NotFound("Proveedor no encontrado");

        var totalIngresos = proveedor.Ingresos.Sum(i => i.CantidadKg * i.PrecioPorKg);
        var totalPagos = proveedor.Pagos.Sum(p => p.Monto);

        return Ok(new
        {
            proveedor = proveedor.Nombre,
            totalIngresos,
            totalPagos,
            saldoPendiente = totalIngresos - totalPagos,
            pagos = proveedor.Pagos.OrderByDescending(p => p.Fecha)
        });
    }

    // POST /api/pagosproveedores
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PagoProveedorDTO dto)
    {
        var proveedor = await _context.Proveedores
            .Include(p => p.Ingresos)
            .Include(p => p.Pagos)
            .FirstOrDefaultAsync(p => p.Id == dto.ProveedorId);

        if (proveedor == null) return NotFound("Proveedor no encontrado");

        var saldoPendiente = proveedor.Ingresos.Sum(i => i.CantidadKg * i.PrecioPorKg)
                           - proveedor.Pagos.Sum(p => p.Monto);

        if (dto.Monto > saldoPendiente)
            return BadRequest($"El monto supera el saldo pendiente de ${saldoPendiente}");

        var pago = new PagoProveedor
        {
            ProveedorId = dto.ProveedorId,
            Monto = dto.Monto,
            MetodoPago = dto.MetodoPago,
            Notas = dto.Notas,
            Fecha = DateTime.UtcNow
        };

        _context.PagosProveedores.Add(pago);
        await _context.SaveChangesAsync();

        await _auditoria.RegistrarAsync(
        "CREATE",
        "PagoProveedor",
        $"Pago de ${dto.Monto} a {proveedor.Nombre} via {dto.MetodoPago}"
);

        return CreatedAtAction(nameof(GetByProveedor), new { proveedorId = pago.ProveedorId }, pago);
    }
}