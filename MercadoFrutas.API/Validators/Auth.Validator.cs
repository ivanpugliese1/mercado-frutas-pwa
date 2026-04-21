using FluentValidation;
using MercadoFrutas.API.DTOs;

namespace MercadoFrutas.API.Validators;

public class AuthValidator : AbstractValidator<AuthDTO>
{
    public AuthValidator()
    {
        RuleFor(x => x.NombreUsuario)
            .NotEmpty().WithMessage("El nombre de usuario es obligatorio")
            .MinimumLength(3).WithMessage("El nombre de usuario debe tener al menos 3 caracteres")
            .MaximumLength(50).WithMessage("El nombre de usuario no puede superar los 50 caracteres")
            .Matches("^[a-zA-Z0-9_]+$").WithMessage("El nombre de usuario solo puede contener letras, números y guiones bajos");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("La contraseña es obligatoria")
            .MinimumLength(4).WithMessage("La contraseña debe tener al menos 4 caracteres")
            .MaximumLength(100).WithMessage("La contraseña no puede superar los 100 caracteres");
    }
}