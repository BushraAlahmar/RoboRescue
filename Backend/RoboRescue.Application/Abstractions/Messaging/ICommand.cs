using MediatR;
using RoboRescue.Domain.Abstractions;

namespace RoboRescue.Application.Abstractions.Messaging;

public interface ICommand : IRequest<Result>, IBaseCommand
{
    
}

public interface ICommand<TResponse> : IRequest<Result<TResponse>>, IBaseCommand
{
    
}

public interface IBaseCommand
{
    
}