using System.Net;
using System.Text.Json;
using RoboRescue.Application.Authentication.Dtos;

namespace RoboRescue.Application.Abstractions.ExternalProviders
{
    public class FacebookAuthProvider
    {
        private readonly string _appId;
        private readonly string _appSecret;
        private readonly string _redirectUrl;
        private readonly HttpClient _httpClient;

        public FacebookAuthProvider(HttpClient? httpClient, string appid, string appsecret)
        {
            _appId = appid;
            _appSecret = appsecret;
            _redirectUrl = "https://localhost:7258/api/Authentication/callback";

            _httpClient = httpClient ?? new HttpClient();
        }

        public string GenerateLoginUrl(List<string>? scopes)
        {
            if (string.IsNullOrWhiteSpace(_redirectUrl) || string.IsNullOrWhiteSpace(_appId))
                throw new Exception("Redirect URL or ClientId, is null or empty");

            if (!_redirectUrl.ToLower().StartsWith("http"))
                throw new Exception("Redirect URL must start with http");


            var url = $"https://www.facebook.com/dialog/oauth?client_id={_appId}&redirect_uri={_redirectUrl}";

            return url;
        }


        public async Task<string?> GetAccessToken(string code, CancellationToken cancellationToken)
        {
            var url1 =
                $"https://graph.facebook.com/v2.4/oauth/access_token?redirect_uri={_redirectUrl}&client_id={_appId}&client_secret={_appSecret}&code={code}";

            var resp1 = await _httpClient.PostAsync(new Uri(url1), null, cancellationToken);
            if (resp1.StatusCode != HttpStatusCode.OK)
                throw new Exception("Failed URL1");

            var resp1Map =
                JsonSerializer.Deserialize<Dictionary<string, object?>>(
                    await resp1.Content.ReadAsByteArrayAsync(cancellationToken));

            if (resp1Map is null) throw new Exception("error in json des");

            var accessToken = resp1Map["access_token"]?.ToString();
            return string.IsNullOrWhiteSpace(accessToken) ? null : accessToken;
        }

        public async Task<FacebookUserInfo> GetMainUserInfo(string accessToken,
            CancellationToken cc)
        {
            var url2 = $"https://graph.facebook.com/me?fields=id,name,email,picture&access_token={accessToken}";
            var resp2 = await _httpClient.GetAsync(new Uri(url2), cc);
            if (!resp2.IsSuccessStatusCode)
                throw new Exception("Failed URL2");

            var userinfo =
                JsonSerializer.Deserialize<FacebookUserInfo>(
                    await resp2.Content.ReadAsByteArrayAsync(cc));
            if (userinfo is null) throw new Exception("UserInfo map is null");

            return userinfo;
        }
    }

}
