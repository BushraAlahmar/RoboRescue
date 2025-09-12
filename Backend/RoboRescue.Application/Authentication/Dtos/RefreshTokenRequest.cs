namespace RoboRescue.Application.Authentication.Dtos;

public abstract record RefreshTokenRequest
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
}