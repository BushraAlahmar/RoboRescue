namespace RoboRescue.Application.Sections.Dtos;

public class SectionsResponse
{
    public Guid Id { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public string Name { get; set; } = null!;
    public int SectionNumber { get; set; }
    public string Description { get; set; } = null!;
    public int UserLastLevelFinishNumber { get; set; }
    public ICollection<LevelResponseForSection> Levels { get; set; } = new List<LevelResponseForSection>();
}