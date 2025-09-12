using FluentValidation;
using MediatR;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Exceptions;
using ValidationException = RoboRescue.Application.Exceptions.ValidationException;

namespace RoboRescue.Application.Abstractions.Behaviors;

internal sealed class ValidationBehavior<TRequest, TResponse>(IEnumerable<IValidator<TRequest>> validators)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IBaseCommand
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!validators.Any())
        {
            return await next();
        }

        var context = new ValidationContext<TRequest>(request);

        var validationErrors = validators
            .Select(validator => validator.ValidateAsync(context, cancellationToken))
            .Where(validationResult => validationResult.Result.Errors.Any())
            .SelectMany(validationResult => validationResult.Result.Errors)
            .Select(validationFailure => new ValidationError(
                validationFailure.PropertyName,
                validationFailure.ErrorMessage))
            .ToList();

        if (validationErrors.Any())
        {
            throw new ValidationException(validationErrors);
        }

        return await next();
    }
}