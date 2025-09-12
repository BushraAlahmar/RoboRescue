using System.Security.Cryptography;
using System.Text;
using RoboRescue.Domain.Users.Services;

namespace RoboRescue.Application.Abstractions;

public sealed class PasswordService : IPasswordService
{
    public string Hash(string plainPassword)
    {
        using var hasher = SHA256.Create();
        return Convert.ToHexString(hasher.ComputeHash(Encoding.UTF8.GetBytes(plainPassword)));
    }

    public bool Compare(string plainPassword, string hash)
    {
        return Hash(plainPassword).Equals(hash);
    }
}