using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RoboRescue.Domain.CodeAnalyzers;

namespace RoboRescue.Infrastructure.TypeConfigurations;

internal sealed class CodeAnalyzerTypeConfiguration : IEntityTypeConfiguration<CodeAnalyzer>
{
    public void Configure(EntityTypeBuilder<CodeAnalyzer> builder)
    {
    }
}