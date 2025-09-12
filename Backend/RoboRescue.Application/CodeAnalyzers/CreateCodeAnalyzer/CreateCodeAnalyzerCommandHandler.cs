using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.CodeAnalyzers;

namespace RoboRescue.Application.CodeAnalyzers.CreateCodeAnalyzer;

internal class CreateCodeAnalyzerCommandHandler(
    IRepository<CodeAnalyzer> repository,
    IUnitOfWork unitOfWork) : ICommandHandler<CreateCodeAnalyzerCommand, Guid>
{
    public async Task<Result<Guid>> Handle(CreateCodeAnalyzerCommand request, CancellationToken cancellationToken)
    {
        var codeAnalyzer = CodeAnalyzer.Create(request.ClassCount, request.InterfaceCount, request.HasInheritance,
            request.HasInterfaceImplementation, request.HasEncapsulation, request.HasPrivateMembers,
            request.HasProtectedMembers, request.HasAbstractClass, request.HasPolymorphism, request.HasFinalMembers,
            request.HasGenerics, request.HasComposition, request.HasMethodOverloading,
            request.HasConstructorOverloading, request.HasStaticMembers, request.HasAbstractMethods);
        await repository.Add(codeAnalyzer, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success(codeAnalyzer.Id);
    }
}