using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.JWT;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Authentication.Dtos;
using RoboRescue.Application.Authentication.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.RefreshTokens;
using RoboRescue.Domain.Users;

namespace RoboRescue.Application.Authentication.RefreshTokens;

public class RefreshTokenCommandHandler(
    IRepository<RefreshToken> repository,
    IRepository<User> userRepository,
    IGenerateRefreshToken generateRefreshToken,
    IJwtExtractor jwtExtractor,
    IJWTGenerator jwtGenerator,
    IUnitOfWork unitOfWork) : ICommandHandler<RefreshTokenCommand, RefreshTokenResponse>
{
    public async Task<Result<RefreshTokenResponse>> Handle(RefreshTokenCommand request,
        CancellationToken cancellationToken)
    {
        var claims = jwtExtractor.Extract(request.AccessToken);
        if (claims == null || claims.Count == 0)
        {
            return Result.Failure<RefreshTokenResponse>(Error.IncorrectCredentials);
        }

        var userId = claims!.FirstOrDefault(c => c.Type == "Id")?.Value;
        if (userId is null)
        {
            return Result.Failure<RefreshTokenResponse>(Error.IncorrectCredentials);
        }

        var user = await userRepository.GetAllWithRelated(new GetUserById(Guid.Parse(userId)), cancellationToken,
            u => u.RefreshTokens);
        if (user == null || user.Count == 0)
        {
            return Result.Failure<RefreshTokenResponse>(Error.IncorrectCredentials);
        }

        var rtExist = user.First().RefreshTokens
            .FirstOrDefault(r => r.UserId == Guid.Parse(userId) && r.IsUsed == false);
        if (rtExist is null)
        {
            return Result.Failure<RefreshTokenResponse>(Error.IncorrectCredentials);
        }


        var compareRefreshToken = Equals(generateRefreshToken.HashRefreshToken(request.RefreshToken), rtExist.Token);
        if (!compareRefreshToken)
        {
            return Result.Failure<RefreshTokenResponse>(Error.IncorrectCredentials);
        }

        if (rtExist.Expired < DateTimeOffset.Now)
        {
            return Result.Failure<RefreshTokenResponse>(Error.IncorrectCredentials);
        }

        if (!string.Equals(user.First().GenerateSecurityHash(), rtExist.UserSecurityHash))
        {
            return Result.Failure<RefreshTokenResponse>(Error.IncorrectCredentials);
        }

        rtExist.ExpireToken();
        repository.Update(rtExist);
        var rt = RefreshToken.CreateRefreshToken();
        var ert = generateRefreshToken.GRefreshToken(rt, user.First());
        var at = jwtGenerator.Generate(user.First(), ert.Id);
        await repository.Add(ert, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return new RefreshTokenResponse(at, rt, Guid.Parse(userId));
    }
}