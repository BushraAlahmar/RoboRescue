using System.Net;
using System.Text.Json;
using RoboRescue.Application.Authentication.Dtos;

namespace RoboRescue.Application.Abstractions.ExternalProviders;

public class GoogleAuthProvider
{
    private readonly string _clientId;
    private readonly string _clientSecret;
    private readonly string _redirectUrl;
    private readonly HttpClient _httpClient;

    public GoogleAuthProvider(HttpClient? httpClient, string clientid, string clientsecret)
    {
        _clientId = clientid;
        _clientSecret = clientsecret;
        _redirectUrl = "https://localhost:7258/api/Authentication/callback";

        _httpClient = httpClient ?? new HttpClient();
    }

    public string GenerateLoginUrl(List<string>? scopes)
    {
        if (string.IsNullOrWhiteSpace(_redirectUrl) || string.IsNullOrWhiteSpace(_clientId))
            throw new Exception("Redirect URL or ClientId, is null or empty");

        if (!_redirectUrl.ToLower().StartsWith("http"))
            throw new Exception("Redirect URL must start with http");

        if (scopes is null)
        {
            scopes = new List<string>()
            {
                "https://www.googleapis.com/auth/userinfo.email",
                "https://www.googleapis.com/auth/userinfo.profile",
            };
        }

        scopes.AddRange(new List<string>()
        {
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
        });

        scopes = scopes.ToHashSet().ToList();


        var url = "https://accounts.google.com/o/oauth2/auth?response_type=code&redirect_uri=" + _redirectUrl +
                  $"&scope={string.Join("%20", scopes)}&client_id=" +
                  _clientId;

        return url;
    }


    public async Task<string?> GetAccessToken(string code, CancellationToken cancellationToken)
    {
        var url1 =
            $"https://accounts.google.com/o/oauth2/token?code={code}&client_id={_clientId}&client_secret={_clientSecret}&redirect_uri={_redirectUrl}&grant_type=authorization_code";

        var resp1 = await _httpClient.PostAsync(new Uri(url1), null, cancellationToken);
        if (resp1.StatusCode != HttpStatusCode.OK)
            throw new Exception("Failed URL1");

        var resp1Map =
            JsonSerializer.Deserialize<Dictionary<string, object?>>(
                await resp1.Content.ReadAsByteArrayAsync(cancellationToken));

        if (resp1Map is null) throw new Exception("error in json des");

        var accessToken = resp1Map["access_token"]?.ToString();
        if (string.IsNullOrWhiteSpace(accessToken)) return null;

        return accessToken;
    }

    public async Task<GoogleUserInfo> GetMainUserInfo(string accessToken,
        CancellationToken cancellationToken)
    {
        var url2 = $"https://www.googleapis.com/oauth2/v2/userinfo?access_token={accessToken}";
        var resp2 = await _httpClient.GetAsync(new Uri(url2), cancellationToken);
        if (!resp2.IsSuccessStatusCode)
            throw new Exception("Failed URL2");

        var userinfo =
            JsonSerializer.Deserialize<GoogleUserInfo>(
                await resp2.Content.ReadAsByteArrayAsync(cancellationToken));

        if (userinfo is null) throw new Exception("UserInfo map is null");

        return userinfo;
    }
}