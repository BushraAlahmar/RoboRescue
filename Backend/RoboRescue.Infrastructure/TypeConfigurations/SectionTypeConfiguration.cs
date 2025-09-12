using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RoboRescue.Domain.Sections;

namespace RoboRescue.Infrastructure.TypeConfigurations;

internal class SectionTypeConfiguration : IEntityTypeConfiguration<Section>
{
    public void Configure(EntityTypeBuilder<Section> builder)
    {
        
    }
}