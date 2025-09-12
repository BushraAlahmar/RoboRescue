using Ardalis.Specification;
using RoboRescue.Domain.Users;

namespace RoboRescue.Application.Authentication.Specifications;

internal sealed class GetUserById : Specification<User>
{
    public GetUserById(Guid userId)
    {
        Query.Where(u => u.Id == userId);
    }
}