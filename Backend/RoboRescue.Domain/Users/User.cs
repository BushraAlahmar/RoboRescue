using System.Security.Cryptography;
using System.Text;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.EmailTokens;
using RoboRescue.Domain.PasswordResetTokens;
using RoboRescue.Domain.RefreshTokens;
using RoboRescue.Domain.UserLevels;
using RoboRescue.Domain.Users.Services;

namespace RoboRescue.Domain.Users;

public sealed class User : BaseEntity
{
    private User(
        Guid id,
        string firstName,
        string lastName,
        DateTimeOffset birthDate,
        string userName,
        string password,
        string email,
        string fcmToken) : base(id)
    {
        FirstName = firstName;
        LastName = lastName;
        BirthDate = birthDate;
        UserName = userName;
        Password = password;
        Email = email;
        FcmToken = fcmToken;
        IsActive = null;
        RefreshTokens = new List<RefreshToken>();
        EmailTokens = new List<EmailToken>();
        UserSections = new List<UserLevel>();
        PasswordResetTokens = new List<PasswordResetToken>();
    }

    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public DateTimeOffset BirthDate { get; private set; }
    public string UserName { get; private set; }
    public string Password { get; private set; }
    public string Email { get; private set; }
    public string FcmToken { get; private set; }
    public DateTimeOffset? IsActive { get; private set; }
    public ICollection<RefreshToken> RefreshTokens { get; init; }
    public ICollection<EmailToken> EmailTokens { get; init; }
    public ICollection<UserLevel> UserSections { get; init; }
    public ICollection<PasswordResetToken> PasswordResetTokens { get; init; }

    public static User Create(
        string firstName,
        string lastName,
        DateTimeOffset birthDate,
        string userName,
        string password,
        string email,
        string fcmToken,
        IPasswordService passwordService)
    {
        var user = new User(Guid.NewGuid(), firstName, lastName, birthDate, userName,
            passwordService.Hash(password),
            email, fcmToken);
        return user;
    }

    public void Update(
        string firstName,
        string lastName,
        DateTimeOffset birthDate,
        string userName)
    {
        FirstName = firstName;
        LastName = lastName;
        BirthDate = birthDate;
        UserName = userName;
    }

    public void ActiveEmail()
    {
        IsActive = DateTimeOffset.UtcNow;
    }

    public void UpdateFcm(string fcm)
    {
        FcmToken = fcm;
    }

    public void UpdatePassword(string password,
        IPasswordService passwordService)
    {
        Password = passwordService.Hash(password);
    }

    public bool CheckPassword(string password,
        IPasswordService passwordService)
    {
        return passwordService.Compare(password, Password);
    }

    public string GenerateSecurityHash()
    {
        return ComputeSha512Hash(this.UserName + this.Password);
    }


    private static string ComputeSha512Hash(string rawData)
    {
        // Create a SHA256
        using SHA512 sha512Hash = SHA512.Create();
        // ComputeHash - returns byte array
        var bytes = sha512Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

        // Convert byte array to a string
        var builder = new StringBuilder();
        foreach (var t in bytes)
        {
            builder.Append(t.ToString("x2"));
        }

        return builder.ToString();
    }
}