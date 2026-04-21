using FluentValidation;
using MercadoFrutas.API.DTOs;

namespace MercadoFrutas.API.Validators;

public class PagoProveedorValidator : AbstractValidator<PagoProveedorDTO>
{
    public PagoProveedorValidator()
    {
        RuleFor(x => x.ProveedorId)
            .GreaterThan(0).WithMessage("Seleccioná un proveedor válido");

        RuleFor(x => x.Monto)
            .GreaterThan(0).WithMessage("El monto debe ser mayor a 0");

        RuleFor(x => x.MetodoPago)
            .NotEmpty().WithMessage("El método de pago es obligatorio")
            .Must(m => m == "efectivo" || m == "transferencia")
            .WithMessage("El método de pago debe ser 'efectivo' o 'transferencia'");
    }
}