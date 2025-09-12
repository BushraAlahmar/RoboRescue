using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RoboRescue.Domain.EmailTokens;

namespace RoboRescue.Infrastructure.TypeConfigurations;

internal class EmailTokenTypeConfiguration : IEntityTypeConfiguration<EmailToken>
{
    public void Configure(EntityTypeBuilder<EmailToken> builder)
    {
    }
}