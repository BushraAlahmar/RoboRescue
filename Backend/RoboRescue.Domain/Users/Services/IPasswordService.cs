namespace RoboRescue.Domain.Users.Services;

public interface IPasswordService
{
    string Hash(string plainPassword);
    bool Compare(string plainPassword, string hash);
}