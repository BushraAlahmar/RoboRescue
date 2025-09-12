namespace RoboRescue.Application.Sections.Dtos;

public class LevelResponseForSection
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public int LevelNumber { get; set; }
    public string Description { get; set; } = null!;
    public string Task { get; set; } = null!;
    public string SuccessMessage { get; set; } = null!;
    public string? DependOnCode { get; set; }
}