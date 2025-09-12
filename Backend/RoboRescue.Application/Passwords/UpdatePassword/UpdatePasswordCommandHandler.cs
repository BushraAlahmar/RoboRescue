using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Authentication.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.Users;

namespace RoboRescue.Application.Passwords.UpdatePassword;

public class UpdatePasswordCommandHandler(IRepository<User> userRepository, IUnitOfWork unitOfWork)
    : ICommandHandler<UpdatePasswordCommand, bool>
{
    public async Task<Result<bool>> Handle(UpdatePasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await userRepository.FirstOrDefaultAsync(new GetUserById(request.UserId), cancellationToken);
        if (user is null) return Result.Failure<bool>(Error.IncorrectCredentials);
        var checkPassword = user.CheckPassword(request.OldPassword, new PasswordService());
        if (!checkPassword) return Result.Failure<bool>(Error.IncorrectCredentials);
        user.UpdatePassword(request.NewPassword, new PasswordService());
        userRepository.Update(user);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success(true);
    }
}