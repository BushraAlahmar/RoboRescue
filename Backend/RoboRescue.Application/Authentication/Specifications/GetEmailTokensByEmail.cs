using Ardalis.Specification;
using RoboRescue.Domain.EmailTokens;

namespace RoboRescue.Application.Authentication.Specifications;

internal sealed class GetEmailTokensByEmail : Specification<EmailToken>
{
    public GetEmailTokensByEmail(string email)
    {
        Query.Where(e => e.Email == email);
    }
}