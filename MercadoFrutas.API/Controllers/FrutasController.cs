using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MercadoFrutas.API.Data;
using MercadoFrutas.API.Models;
using MercadoFrutas.API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace MercadoFrutas.API.Controllers;

[ApiController]
[Route("api/[controller]")] // Define la ruta base para este controller. [controller] es un placeholder que se reemplaza automáticamente por el nombre del controller sin la palabra "Controller".
[Authorize]

public class FrutasController : ControllerBase // Hereda de ControllerBase, lo que le da acceso a funcionalidades para manejar solicitudes HTTP y construir respuestas.
{
    private readonly AppDbContext _context; // Campo privado para almacenar la instancia del DbContext. El guion bajo es una convención común para campos privados. _context — El AppDbContext que .NET inyecta automáticamente en el constructor. A través de él accedés a todas las tablas.

    public FrutasController(AppDbContext context) // El constructor recibe una instancia de AppDbContext. Gracias a la inyección de dependencias configurada en Program.cs, .NET se encarga de crear y pasar esta instancia automáticamente.
    {
        _context = context; // Asigna la instancia recibida al campo privado para que pueda ser usada en los métodos del controller.
    }

    [HttpGet] // Indica que este método responde a solicitudes GET en la ruta api/frutas
    public async Task<ActionResult<IEnumerable<Fruta>>> GetFrutas() // Método asíncrono que devuelve una lista de frutas envuelta en un ActionResult (que permite devolver diferentes tipos de respuestas HTTP).
    {
        var frutas = await _context.Frutas.ToListAsync();
        return Ok(frutas);
    }

    // IActionResult Es el tipo de retorno de los métodos. Representa cualquier respuesta HTTP — Ok() devuelve 200, NotFound() devuelve 404, CreatedAtAction() devuelve 201, NoContent() devuelve 204.
    // GET /api/frutas/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var fruta = await _context.Frutas.FindAsync(id);
        if (fruta == null) return NotFound();
        return Ok(fruta);
    }

    // POST /api/frutas
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CrearFrutaDTO dto)
    {
        var fruta = new Fruta
        {
            Nombre = dto.Nombre,
            EnTemporada = dto.EnTemporada,
            StockKg = dto.StockKg
        };  
    
        _context.Frutas.Add(fruta);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = fruta.Id }, fruta);
    }

    // PUT /api/frutas/1
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Fruta fruta)
    {
        if (id != fruta.Id) return BadRequest();
        _context.Entry(fruta).State = EntityState.Modified;
        await _context.SaveChangesAsync(); // Hasta que no llamás este método, los cambios no se guardan en la base de datos. Es como un commit — podés hacer varios cambios y confirmarlos todos juntos.
        return NoContent();
    }
}