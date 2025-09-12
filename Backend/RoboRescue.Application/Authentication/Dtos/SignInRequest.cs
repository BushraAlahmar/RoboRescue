namespace RoboRescue.Application.Authentication.Dtos;

public abstract record SignInRequest
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Fcm { get; set; } = null!;
}