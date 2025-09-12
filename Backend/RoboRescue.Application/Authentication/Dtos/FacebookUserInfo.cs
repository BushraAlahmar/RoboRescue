namespace RoboRescue.Application.Authentication.Dtos;

public class FacebookUserInfo
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Email { get; set; } = null!;
    public string? Url { get; set; }
    public IDictionary<string, IDictionary<string, dynamic>>? Picture { get; set; }
}