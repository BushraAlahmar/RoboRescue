using Ardalis.Specification;
using RoboRescue.Domain.Users;

namespace RoboRescue.Application.Authentication.Specifications;

internal sealed class GetUserByUsername : Specification<User>
{
    public GetUserByUsername(string username)
    {
        Query.Where(u => u.UserName == username);
    }
}