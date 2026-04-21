namespace MercadoFrutas.API.DTOs;

public class AuthDTO
{
    public string NombreUsuario { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Rol { get; set; }
}