namespace RoboRescue.Application.Users.Dtos;

public class UserResponse
{
    public UserResponse(Guid id, string firstName, string lastName, DateTimeOffset dateOfBirth, string username,
        string email, DateTimeOffset? isActive)
    {
        Id = id;
        FirstName = firstName;
        LastName = lastName;
        BirthDate = dateOfBirth;
        UserName = username;
        Email = email;
        IsActive = isActive;
    }

    public Guid Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public DateTimeOffset BirthDate { get; set; }
    public string UserName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public DateTimeOffset? IsActive { get; set; }
}