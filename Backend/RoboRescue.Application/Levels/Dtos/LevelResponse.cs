namespace RoboRescue.Application.Levels.Dtos;

public class LevelResponse
{
    public Guid Id { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }
    public string Name { get; set; } = null!;
    public string EnName { get; set; } = null!;
    public int LevelNumber { get; set; }
    public Guid SectionId { get; set; }
    public int SectionSectionNumber { get; set; }
    public Guid CodeAnalyzerId { get; set; }
    public string Description { get; set; } = null!;
    public string EnDescription { get; set; } = null!;
    public string Task { get; set; } = null!;
    public string EnTask { get; set; } = null!;
    public string SuccessMessage { get; set; } = null!;
    public string EnSuccessMessage { get; set; } = null!;
    public Guid? DependentOnLevelId { get; set; }
}