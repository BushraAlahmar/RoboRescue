namespace RoboRescue.Application.Levels.Dtos;

public abstract class LevelRequest
{
    public string Name { get; set; } = null!;
    public string EnName { get; set; } = null!;
    public int LevelNumber { get; set; }
    public Guid SectionId { get; set; }
    public Guid CodeAnalyzerId { get; set; }
    public string Task { get; set; } = null!;
    public string EnTask { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string EnDescription { get; set; } = null!;
    public string SuccessMessage { get; set; } = null!;
    public string EnSuccessMessage { get; set; } = null!;
    public Guid? DependentOnLevelId { get; set; }
}