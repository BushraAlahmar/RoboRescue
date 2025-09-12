using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.CodeAnalyzers.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.CodeAnalyzers;

namespace RoboRescue.Application.CodeAnalyzers.UpdateCodeAnalyzer;

internal class UpdateCodeAnalyzerCommandHandler(
    IRepository<CodeAnalyzer> repository,
    IUnitOfWork unitOfWork)
    : ICommandHandler<UpdateCodeAnalyzerCommand, bool>
{
    public async Task<Result<bool>> Handle(UpdateCodeAnalyzerCommand request, CancellationToken cancellationToken)
    {
        var codeAnalyzer =
            await repository.FirstOrDefaultAsync(new GetCodeAnalyzerById(request.CodeAnalyzerId), cancellationToken);
        if (codeAnalyzer is null)
        {
            return Result.Failure<bool>(Error.IncorrectCredentials);
        }

        codeAnalyzer.Update(request.ClassCount, request.InterfaceCount, request.HasInheritance,
            request.HasInterfaceImplementation, request.HasEncapsulation, request.HasPrivateMembers,
            request.HasProtectedMembers, request.HasAbstractClass, request.HasPolymorphism, request.HasFinalMembers,
            request.HasGenerics, request.HasComposition, request.HasMethodOverloading,
            request.HasConstructorOverloading, request.HasStaticMembers, request.HasAbstractMethods);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success(true);
    }
}