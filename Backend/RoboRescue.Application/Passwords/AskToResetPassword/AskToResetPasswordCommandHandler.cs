using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Authentication.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.EmailTokens;
using RoboRescue.Domain.PasswordResetTokens;
using RoboRescue.Domain.Users;

namespace RoboRescue.Application.Passwords.AskToResetPassword;

public class AskToResetPasswordCommandHandler(
    IRepository<User> repository,
    IRepository<PasswordResetToken> passwordResetTokenRepository,
    IMailSender mailSender,
    IUnitOfWork unitOfWork) : ICommandHandler<AskToResetPasswordCommand, bool>
{
    public async Task<Result<bool>> Handle(AskToResetPasswordCommand request, CancellationToken cancellationToken)
    {
        var user =
            await repository.GetWithRelated(new GetUserByEmail(request.Email), cancellationToken,
                u => u.PasswordResetTokens);
        if (user is null) return Result.Failure<bool>(Error.IncorrectCredentials);
        if (user.PasswordResetTokens.Count > 0)
        {
            foreach (var emailToken in user.EmailTokens)
            {
                emailToken.SetAsUsed();
            }
        }

        var newPasswordResetToken = PasswordResetToken.Create(user.Id,
            RandomNumberGenerator.GetInt32(1000_0000, 9999_9999).ToString(),
            DateTimeOffset.UtcNow.AddMinutes(30));
        await passwordResetTokenRepository.Add(newPasswordResetToken, cancellationToken);

        var mailData = new MailData
        {
            Title = "Reset Password",
            Content = "please use this code to reset your email password in RoboRescue",
            ReceiverId = user.Email,
            ReceiverName = user.FirstName + " " + user.LastName,
            EmailSubject = "Reset Password",
            EmailBody = newPasswordResetToken.PasswordToken
        };

        mailSender.SendMail(mailData);

        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success(true);
    }
}