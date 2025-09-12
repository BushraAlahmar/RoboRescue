using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Authentication.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.EmailTokens;
using RoboRescue.Domain.Users;

namespace RoboRescue.Application.Authentication.ActiveEmail;

internal sealed class ActiveEmailCommandHandler(
    IRepository<User> repository,
    IRepository<EmailToken> emailRepository,
    IUnitOfWork unitOfWork) : ICommandHandler<ActiveEmailCommand, bool>
{
    public async Task<Result<bool>> Handle(ActiveEmailCommand request, CancellationToken cancellationToken)
    {
        var user = await repository.GetWithRelated(new GetUserByEmail(request.Email), cancellationToken,
            u => u.EmailTokens);
        if (user is null) return Result.Failure<bool>(Error.IncorrectCredentials);
        var emailToken = user.EmailTokens.FirstOrDefault(t => t.Token == request.Token);
        if (emailToken is null) return Result.Failure<bool>(Error.IncorrectCredentials);
        if(emailToken.IsUsed) return Result.Failure<bool>(Error.IncorrectCredentials);
        user.ActiveEmail();
        emailToken.SetAsUsed();
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success(true);
    }
}