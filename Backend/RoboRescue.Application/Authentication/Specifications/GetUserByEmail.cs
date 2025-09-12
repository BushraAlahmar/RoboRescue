using Ardalis.Specification;
using RoboRescue.Domain.Users;

namespace RoboRescue.Application.Authentication.Specifications;

internal sealed class GetUserByEmail : Specification<User>
{
    public GetUserByEmail(string email)
    {
        Query.Where(u => u.Email == email);
    }
}