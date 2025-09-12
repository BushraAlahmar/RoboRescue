using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Authentication.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.EmailTokens;
using RoboRescue.Domain.Users;
using RoboRescue.Domain.Users.Services;

namespace RoboRescue.Application.Authentication.SignUp;

public class SignUpCommandHandler(
    IRepository<User> repository,
    IRepository<EmailToken> emailTokenRepository,
    IPasswordService passwordService,
    IMailSender mailSender,
    IUnitOfWork unitOfWork) : ICommandHandler<SignUpCommand, bool>
{
    public async Task<Result<bool>> Handle(SignUpCommand request, CancellationToken cancellationToken)
    {
        var userByEmail = await repository.FirstOrDefaultAsync(new GetUserByEmail(request.Email), cancellationToken);
        if (userByEmail is not null)
        {
            return Result.Failure<bool>(Error.EmailExists);
        }

        var userByUsername =
            await repository.FirstOrDefaultAsync(new GetUserByUsername(request.UserName), cancellationToken);
        if (userByUsername is not null)
        {
            return Result.Failure<bool>(Error.UsernameExists);
        }

        var user = User.Create(request.FirstName, request.LastName, request.BirthDate, request.UserName,
            request.Password,
            request.Email, "", passwordService);

        await repository.Add(user, cancellationToken);

        var emailToken = EmailToken.Create(user.Email, user.Id);
        await emailTokenRepository.Add(emailToken, cancellationToken);

        var mailData = new MailData
        {
            Title = "Confirm Your Email",
            Content = "please use this code to active your email in RoboRescue",
            ReceiverId = user.Email,
            ReceiverName = user.FirstName + " " + user.LastName,
            EmailSubject = "Verify Code",
            EmailBody = emailToken.Token
        };
        mailSender.SendMail(mailData);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success<bool>(true);
    }
}