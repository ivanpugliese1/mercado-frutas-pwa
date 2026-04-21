using FluentValidation;
using MercadoFrutas.API.DTOs;

namespace MercadoFrutas.API.Validators;

public class VentaValidator : AbstractValidator<VentaDTO>
{
    public VentaValidator()
    {
        RuleFor(x => x.FrutaId)
            .GreaterThan(0).WithMessage("Seleccioná una fruta válida");

        RuleFor(x => x.CantidadKg)
            .GreaterThan(0).WithMessage("La cantidad debe ser mayor a 0")
            .LessThanOrEqualTo(10000).WithMessage("La cantidad no puede superar los 10.000 kg");

        RuleFor(x => x.PrecioPorKg)
            .GreaterThan(0).WithMessage("El precio debe ser mayor a 0")
            .LessThanOrEqualTo(1000000).WithMessage("El precio parece incorrecto");

        RuleFor(x => x.TipoVenta)
            .NotEmpty().WithMessage("El tipo de venta es obligatorio")
            .Must(t => t == "mayorista" || t == "minorista")
            .WithMessage("El tipo de venta debe ser 'mayorista' o 'minorista'");
    }
}