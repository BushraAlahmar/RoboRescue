using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.Levels;

namespace RoboRescue.Domain.Sections;

public sealed class Section : BaseEntity
{
    private Section(Guid id, string name, string enName, int sectionNumber, string description,
        string enDescription) : base(id)
    {
        Name = name;
        SectionNumber = sectionNumber;
        Description = description;
        Levels = new List<Level>();
        EnName = enName;
        EnDescription = enDescription;
    }

    public string Name { get; private set; }
    public string EnName { get; private set; }
    public int SectionNumber { get; private set; }
    public string Description { get; private set; }
    public string EnDescription { get; private set; }
    public ICollection<Level> Levels { get; set; }

    public static Section Create(string name, string enName, int sectionNumber, string description,
        string enDescription)
    {
        return new Section(Guid.NewGuid(), name, enName, sectionNumber, description, enDescription);
    }

    public void Update(string name, string enName, int sectionNumber, string description,
        string enDescription)
    {
        Name = name;
        SectionNumber = sectionNumber;
        Description = description;
        EnName = enName;
        EnDescription = enDescription;
    }
}