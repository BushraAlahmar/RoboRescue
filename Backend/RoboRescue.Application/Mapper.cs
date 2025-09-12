using Mapster;
using RoboRescue.Application.CodeAnalyzers.Dtos;
using RoboRescue.Application.Levels.Dtos;
using RoboRescue.Application.Sections.Dtos;
using RoboRescue.Application.Users.Dtos;
using RoboRescue.Domain.CodeAnalyzers;
using RoboRescue.Domain.Levels;
using RoboRescue.Domain.Sections;
using RoboRescue.Domain.Users;

namespace RoboRescue.Application;

internal sealed class Mapper : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Section, SectionResponse>().ConstructUsing(section => new SectionResponse());
        config.NewConfig<CodeAnalyzer, CodeAnalyzerResponse>()
            .ConstructUsing(codeAnalyzer => new CodeAnalyzerResponse());
        config.NewConfig<Level, LevelResponse>().ConstructUsing(level => new LevelResponse());
    }
}