namespace RoboRescue.Application.Options;

public class JwtOptions
{
    public required string Key { get; set; }
    public required string Issuer { get; set; }
    public int AccessTokenLifetime { get; set; }
    public int RefreshTokenLifetime { get; set; }
}