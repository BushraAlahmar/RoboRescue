namespace RoboRescue.Application.Authentication.Dtos;

public class GoogleUserInfo
{
    public string? given_name { get; set; }
    public string? family_name { get; set; }

    public string? email { get; set; }

    public bool verified_email { get; set; }
}