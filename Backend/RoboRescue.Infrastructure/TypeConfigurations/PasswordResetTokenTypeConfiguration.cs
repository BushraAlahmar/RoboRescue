using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RoboRescue.Domain.PasswordResetTokens;

namespace RoboRescue.Infrastructure.TypeConfigurations;

public class PasswordResetTokenTypeConfiguration : IEntityTypeConfiguration<PasswordResetToken>
{
    public void Configure(EntityTypeBuilder<PasswordResetToken> builder)
    {
        
    }
}