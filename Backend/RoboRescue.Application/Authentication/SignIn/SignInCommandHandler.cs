using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.JWT;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Authentication.Dtos;
using RoboRescue.Application.Authentication.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.RefreshTokens;
using RoboRescue.Domain.Users;
using RoboRescue.Domain.Users.Services;

namespace RoboRescue.Application.Authentication.SignIn;

internal sealed class SignInCommandHandler(
    IRepository<User> repository,
    IRepository<RefreshToken> rTRepository,
    IPasswordService passwordService,
    IJWTGenerator jwtGenerator,
    IGenerateRefreshToken generateRefreshToken,
    IUnitOfWork unitOfWork) : ICommandHandler<SignInCommand, RefreshTokenResponse>
{
    public async Task<Result<RefreshTokenResponse>> Handle(SignInCommand request, CancellationToken cancellationToken)
    {
        var user =
            await repository.FirstOrDefaultAsync(new GetUserByEmail(request.Email), cancellationToken);
        if (user is null)
        {
            return Result.Failure<RefreshTokenResponse>(Error.IncorrectCredentials);
        }

        if (user.IsActive is null)
        {
            return Result.Failure<RefreshTokenResponse>(Error.IncorrectCredentials);
        }

        if (!passwordService.Compare(request.Password, user.Password))
        {
            return Result.Failure<RefreshTokenResponse>(Error.IncorrectCredentials);
        }

        foreach (var refreshToken in user.RefreshTokens)
        {
            if (refreshToken.IsUsed == false || refreshToken.Expired < DateTimeOffset.UtcNow)
            {
                refreshToken.ExpireToken();
            }
        }

        var isUpdated = repository.Update(user);

        if (!isUpdated)
        {
            return Result.Failure<RefreshTokenResponse>(Error.ServerError);
        }

        var rt = RefreshToken.CreateRefreshToken();
        var ert = generateRefreshToken.GRefreshToken(rt, user);
        var at = jwtGenerator.Generate(user, ert.Id);
        await rTRepository.Add(ert, cancellationToken);
        user.UpdateFcm(request.Fcm);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return new RefreshTokenResponse(at, rt, user.Id);
    }
}