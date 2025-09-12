using MapsterMapper;
using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Users.Dtos;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.Users;

namespace RoboRescue.Application.Users.GetUserById;

class GetUserByIdQueryHandler(IRepository<User> repository)
    : IQueryHandler<GetUserByIdQuery, UserResponse>
{
    public async Task<Result<UserResponse>> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await repository.FirstOrDefaultAsync(new Authentication.Specifications.GetUserById(request.UserId),
            cancellationToken);
        if (user is null)
        {
            return Result.Failure<UserResponse>(Error.IncorrectCredentials);
        }

        var userResponse = new UserResponse(user.Id, user.FirstName, user.LastName, user.BirthDate, user.UserName, user.Email,  user.IsActive);
        return Result.Success(userResponse);
    }
}