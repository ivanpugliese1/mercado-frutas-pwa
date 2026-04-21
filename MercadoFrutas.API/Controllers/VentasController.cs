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
public class VentasController : ControllerBase {

    private readonly AppDbContext _context;
    private readonly AuditoriaService _auditoria;

    public VentasController(AppDbContext context, AuditoriaService auditoria)
    {
        _context = context;
         _auditoria = auditoria;
    }

    [HttpGet]
    public async Task<ActionResult> GetAll() {
        var ventas = await _context.Ventas
            .Include(v => v.Fruta)
            .OrderByDescending(v => v.Fecha)
            .ToListAsync();

        return Ok(ventas);
    }
    
    [HttpGet("hoy")]
    public async Task<ActionResult> GetHoy() {
      var hoy = DateTime.UtcNow.Date;
      var ventas = await _context.Ventas
          .Include(v => v.Fruta)
          .Where(v => v.Fecha.Date == hoy)
          .OrderByDescending(v => v.Fecha)
          .ToListAsync();

      var total = ventas.Sum(v => v.CantidadKg * v.PrecioPorKg);
      return Ok(new { Ventas = ventas, Total = total});     
    }

     // POST /api/ventas
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] VentaDTO dto)
    {
        var fruta = await _context.Frutas.FindAsync(dto.FrutaId);
        if (fruta == null) return NotFound("Fruta no encontrada");

        if (fruta.StockKg < dto.CantidadKg)
            return BadRequest("Stock insuficiente");

        var venta = new Venta
        {
            FrutaId = dto.FrutaId,
            CantidadKg = dto.CantidadKg,
            PrecioPorKg = dto.PrecioPorKg,
            TipoVenta = dto.TipoVenta,
            Notas = dto.Notas,
            Fecha = DateTime.UtcNow
        };

        // Reducir el stock
        fruta.StockKg -= dto.CantidadKg;

        _context.Ventas.Add(venta);
        await _context.SaveChangesAsync();

        await _auditoria.RegistrarAsync(
        "CREATE",
        "Venta",
        $"{dto.CantidadKg}kg de {fruta.Nombre} a ${dto.PrecioPorKg}/kg ({dto.TipoVenta})"
    );


        return CreatedAtAction(nameof(GetAll), new { id = venta.Id }, venta);
    }
}    