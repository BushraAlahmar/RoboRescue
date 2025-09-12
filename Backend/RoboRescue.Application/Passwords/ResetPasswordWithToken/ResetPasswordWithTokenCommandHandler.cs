using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Authentication.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.PasswordResetTokens;
using RoboRescue.Domain.Users;

namespace RoboRescue.Application.Passwords.ResetPasswordWithToken;

public class ResetPasswordWithTokenCommandHand(
    IRepository<User> userRepository,
    IRepository<PasswordResetToken> passwordResetTokenRepository,
    IUnitOfWork unitOfWork)
    : ICommandHandler<ResetPasswordWithTokenCommand, bool>
{
    public async Task<Result<bool>> Handle(ResetPasswordWithTokenCommand request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetWithRelated(new GetUserByEmail(request.Email), cancellationToken,
            u => u.PasswordResetTokens);
        if (user is null)
        {
            return Result.Failure<bool>(Error.IncorrectCredentials);
        }

        var token = user.PasswordResetTokens.FirstOrDefault(t => t.PasswordToken == request.Token && !t.IsUsed);
        if (token is null)
        {
            return Result.Failure<bool>(Error.IncorrectCredentials);
        }

        token.SetAsUsed();
        passwordResetTokenRepository.Update(token);

        user.UpdatePassword(request.NewPassword, new PasswordService());
        userRepository.Update(user);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success(true);
    }
}