using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RoboRescue.Domain.UserLevels;

namespace RoboRescue.Infrastructure.TypeConfigurations;

internal sealed class UserSectionTypeConfiguration : IEntityTypeConfiguration<UserLevel>
{
    public void Configure(EntityTypeBuilder<UserLevel> builder)
    {
        
    }
}