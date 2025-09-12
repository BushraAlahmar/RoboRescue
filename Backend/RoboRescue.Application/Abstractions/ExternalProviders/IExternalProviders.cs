namespace RoboRescue.Application.Abstractions.ExternalProviders;

public interface IExternalProviders<T, TUserInfo> where T : class where TUserInfo : class
{
    string GenerateLoginUrl(List<string>? scopes);
    Task<string?> GetAccessToken(string code, CancellationToken cancellationToken);
    Task<TUserInfo> GetMainUserInfo(string accessToken, CancellationToken cc);
}