namespace RoboRescue.Application.Authentication.Dtos;

public sealed record RefreshTokenResponse
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public Guid UserId { get; set; }

    public RefreshTokenResponse(string accessToken, string refreshToken, Guid userId)
    {
        AccessToken = accessToken;
        RefreshToken = refreshToken;
        UserId = userId;
    }
};