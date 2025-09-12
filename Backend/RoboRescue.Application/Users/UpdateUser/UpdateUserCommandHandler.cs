using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Authentication.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.Users;

namespace RoboRescue.Application.Users.UpdateUser;

internal class UpdateUserCommandHandler(
    IRepository<User> repository,
    IUnitOfWork unitOfWork) : ICommandHandler<UpdateUserCommand, bool>
{
    public async Task<Result<bool>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await repository.FirstOrDefaultAsync(new Authentication.Specifications.GetUserById(request.UserId),
            cancellationToken);
        if (user is null)
        {
            return Result.Failure<bool>(Error.IncorrectCredentials);
        }

        user.Update(request.FirstName, request.LastName, request.BirthDate, request.UserName);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success(true);
    }
}