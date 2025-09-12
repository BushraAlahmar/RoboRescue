namespace RoboRescue.Application.Authentication.Dtos;

public class SignUpRequest
{
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public DateTimeOffset BirthDate { get; set; }
    public string UserName { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Email { get; set; } = null!;
}