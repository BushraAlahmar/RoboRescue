namespace RoboRescue.Application.Sections.Dtos;

public abstract class SectionRequest
{
    public string Name { get; set; } = null!;
    public string EnName { get; set; } = null!;
    public int SectionNumber { get; set; }
    public string Description { get; set; } = null!;
    public string EnDescription { get; set; } = null!;
}