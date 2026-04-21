using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MercadoFrutas.API.Data;
using MercadoFrutas.API.Models;
using MercadoFrutas.API.DTOs;

namespace MercadoFrutas.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    // POST /api/auth/registro
    [HttpPost("registro")]
    public async Task<IActionResult> Registro([FromBody] AuthDTO dto)
    {
        var existe = await _context.Usuarios
            .AnyAsync(u => u.NombreUsuario == dto.NombreUsuario);

        if (existe) return BadRequest("El nombre de usuario ya existe");

        var usuario = new Usuario
        {
            NombreUsuario = dto.NombreUsuario,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Rol = dto.Rol ?? "empleado"
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return Ok("Usuario creado correctamente");
    }

    // POST /api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthDTO dto)
    {
        Console.WriteLine($"NombreUsuario: '{dto.NombreUsuario}' Password: '{dto.Password}'");
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.NombreUsuario == dto.NombreUsuario);

                Console.WriteLine($"Usuario encontrado: {usuario?.NombreUsuario ?? "NULL"}");
    Console.WriteLine($"Hash guardado: {usuario?.PasswordHash ?? "NULL"}");

        if (usuario == null) return Unauthorized("Usuario o contraseña incorrectos");

        var passwordValida = BCrypt.Net.BCrypt.Verify(dto.Password, usuario.PasswordHash);
           Console.WriteLine($"Password valida: {passwordValida}");
        if (!passwordValida) return Unauthorized("Usuario o contraseña incorrectos");

        var token = GenerarToken(usuario);
        return Ok(new { token, rol = usuario.Rol, nombreUsuario = usuario.NombreUsuario });
    }

    private string GenerarToken(Usuario usuario)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));

        var credenciales = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Name, usuario.NombreUsuario),
            new Claim(ClaimTypes.Role, usuario.Rol)
        };

        var expiracion = DateTime.UtcNow.AddHours(
            double.Parse(_config["Jwt:ExpirationHours"]!));

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: expiracion,
            signingCredentials: credenciales
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}