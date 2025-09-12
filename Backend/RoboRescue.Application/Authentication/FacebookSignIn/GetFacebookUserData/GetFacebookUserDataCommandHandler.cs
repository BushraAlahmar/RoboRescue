using Microsoft.Extensions.Configuration;
using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.ExternalProviders;
using RoboRescue.Application.Abstractions.JWT;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Authentication.Dtos;
using RoboRescue.Application.Authentication.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.RefreshTokens;
using RoboRescue.Domain.Users;
using RoboRescue.Domain.Users.Services;

namespace RoboRescue.Application.Authentication.FacebookSignIn.GetFacebookUserData;

internal class GetFacebookUserDataCommandHandler(
    IRepository<User> repository,
    IRepository<RefreshToken> rTRepository,
    IPasswordService passwordService,
    IJWTGenerator jwtGenerator,
    IGenerateRefreshToken generateRefreshToken,
    IUnitOfWork unitOfWork,
    IConfiguration configuration)
    : ICommandHandler<GetFacebookUserDataCommand, RefreshTokenResponse>
{
    public async Task<Result<RefreshTokenResponse>> Handle(GetFacebookUserDataCommand request,
        CancellationToken cancellationToken)
    {
        var facebookAuthProvider = new FacebookAuthProvider(null
            , configuration["Authentication:Facebook:AppId"]!
            , configuration["Authentication:Facebook:AppSecret"]!
        );
        var accessToken = await facebookAuthProvider.GetAccessToken(request.Code, cancellationToken);
        if (accessToken is null)
        {
            return Result.Failure<RefreshTokenResponse>(Error.IncorrectCredentials);
        }

        var userinfo = await facebookAuthProvider.GetMainUserInfo(accessToken, cancellationToken);
        if (userinfo.Email != null)
        {
            var user = await repository.FirstOrDefaultAsync(new GetUserByEmail(userinfo.Email), cancellationToken);
            if (user is null)
            {
                return Result.Failure<RefreshTokenResponse>(Error.IncorrectCredentials);
            }

            if (user.IsActive is null)
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
            return new RefreshTokenResponse(at, rt, user.Id);
        }

        var password = Guid.NewGuid().ToString() + Guid.NewGuid().ToString() + Guid.NewGuid().ToString() +
                       Guid.NewGuid().ToString() + Guid.NewGuid().ToString() + Guid.NewGuid().ToString();
        var createdUser = User.Create(userinfo.Name.Split(" ")[0], userinfo.Name.Split(" ")[1],
            DateTimeOffset.Now.AddYears(-25), Guid.NewGuid().ToString("n")[..8], password,
            userinfo.Email ?? "", "", passwordService);

        await repository.Add(createdUser, cancellationToken);
        var newRt = RefreshToken.CreateRefreshToken();
        var newErt = generateRefreshToken.GRefreshToken(newRt, createdUser);
        var newAt = jwtGenerator.Generate(createdUser, newErt.Id);
        await rTRepository.Add(newErt, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return new RefreshTokenResponse(newAt, newRt, createdUser.Id);
    }
}