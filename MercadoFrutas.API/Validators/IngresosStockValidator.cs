using FluentValidation;
using MercadoFrutas.API.DTOs;

namespace MercadoFrutas.API.Validators;

public class IngresoStockValidator : AbstractValidator<IngresoStockDTO>
{
    public IngresoStockValidator()
    {
        RuleFor(x => x.FrutaId)
            .GreaterThan(0).WithMessage("Seleccioná una fruta válida");

        RuleFor(x => x.ProveedorId)
            .GreaterThan(0).WithMessage("Seleccioná un proveedor válido");

        RuleFor(x => x.CantidadKg)
            .GreaterThan(0).WithMessage("La cantidad debe ser mayor a 0")
            .LessThanOrEqualTo(50000).WithMessage("La cantidad no puede superar los 50.000 kg");

        RuleFor(x => x.PrecioPorKg)
            .GreaterThan(0).WithMessage("El precio debe ser mayor a 0");
    }
}