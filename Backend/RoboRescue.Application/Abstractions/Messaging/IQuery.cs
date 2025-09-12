using MediatR;
using RoboRescue.Domain.Abstractions;

namespace RoboRescue.Application.Abstractions.Messaging;

public interface IQuery<TResponse> : IRequest<Result<TResponse>>
{
}