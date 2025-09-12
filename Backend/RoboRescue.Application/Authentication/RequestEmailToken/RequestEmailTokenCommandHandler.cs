using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Authentication.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.EmailTokens;
using RoboRescue.Domain.Users;

namespace RoboRescue.Application.Authentication.RequestEmailToken;

public class RequestEmailTokenCommandHandler(
    IRepository<User> repository,
    IRepository<EmailToken> emailTokenRepository,
    IMailSender mailSender,
    IUnitOfWork unitOfWork) : ICommandHandler<RequestEmailTokenCommand, bool>
{
    public async Task<Result<bool>> Handle(RequestEmailTokenCommand request, CancellationToken cancellationToken)
    {
        var user =
            await repository.GetWithRelated(new GetUserByEmail(request.Email), cancellationToken, u => u.EmailTokens);
        if (user is null || user.IsActive is not null) return Result.Failure<bool>(Error.IncorrectCredentials);
        if (user.EmailTokens.Count > 0)
        {
            foreach (var emailToken in user.EmailTokens)
            {
                emailToken.SetAsUsed();
            }
        }

        var newEmailToken = EmailToken.Create(request.Email, user.Id);
        await emailTokenRepository.Add(newEmailToken, cancellationToken);

        var mailData = new MailData
        {
            Title = "Confirm Your Email",
            Content = "please use this code to active your email in RoboRescue",
            ReceiverId = user.Email,
            ReceiverName = user.FirstName + " " + user.LastName,
            EmailSubject = "Verify Code",
            EmailBody = newEmailToken.Token
        };
        mailSender.SendMail(mailData);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success(true);
    }
}