namespace RoboRescue.Application.Sections.Dtos;

public class SectionResponse
{
    public Guid Id { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }
    public string Name { get; set; } = null!;
    public string EnName { get; set; } = null!;
    public int SectionNumber { get; set; }
    public string Description { get; set; } = null!;
    public string EnDescription { get; set; } = null!;
}