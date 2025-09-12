using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.CodeAnalyzers;
using RoboRescue.Domain.Sections;
using RoboRescue.Domain.UserLevels;

namespace RoboRescue.Domain.Levels;

public sealed class Level : BaseEntity
{
    private Level(Guid id, string name, string enName, int levelNumber, Guid sectionId, Guid codeAnalyzerId,
        string description,
        string enDescription, string task, string enTask, string successMessage, string enSuccessMessage,
        Guid? dependentOnLevelId) : base(id)
    {
        Name = name;
        LevelNumber = levelNumber;
        SectionId = sectionId;
        CodeAnalyzerId = codeAnalyzerId;
        Section = null!;
        CodeAnalyzer = null!;
        Description = description;
        Task = task;
        SuccessMessage = successMessage;
        DependentOnLevelId = dependentOnLevelId;
        UserLevels = new List<UserLevel>();
        EnName = enName;
        EnDescription = enDescription;
        EnTask = enTask;
        EnSuccessMessage = enSuccessMessage;
    }

    public string Name { get; private set; }
    public string EnName { get; private set; }
    public int LevelNumber { get; private set; }
    public Guid SectionId { get; private set; }
    public Section Section { get; private set; }
    public Guid CodeAnalyzerId { get; private set; }
    public CodeAnalyzer CodeAnalyzer { get; private set; }
    public string Description { get; private set; }
    public string EnDescription { get; private set; }
    public string Task { get; private set; }
    public string EnTask { get; private set; }
    public string SuccessMessage { get; private set; }
    public string EnSuccessMessage { get; private set; }
    public Guid? DependentOnLevelId { get; private set; }
    public Level? DependentOnLevel { get; private set; }
    public ICollection<UserLevel> UserLevels { get; private set; }


    public static Level Create(string name, string enName, int levelNumber, Guid sectionId, Guid codeAnalyzerId,
        string description,
        string enDescription, string task, string enTask, string successMessage, string enSuccessMessage,
        Guid? dependentOnLevelId)
    {
        return new Level(Guid.NewGuid(), name, enName, levelNumber, sectionId, codeAnalyzerId, description,
            enDescription, task, enTask, successMessage, enSuccessMessage, dependentOnLevelId);
    }

    public void Update(string name, string enName, int levelNumber, Guid sectionId, Guid codeAnalyzerId,
        string description,
        string enDescription, string task, string enTask, string successMessage, string enSuccessMessage,
        Guid? dependentOnLevelId)
    {
        Name = name;
        LevelNumber = levelNumber;
        SectionId = sectionId;
        CodeAnalyzerId = codeAnalyzerId;
        Description = description;
        Task = task;
        SuccessMessage = successMessage;
        DependentOnLevelId = dependentOnLevelId;
        EnName = enName;
        EnDescription = enDescription;
        EnTask = enTask;
        EnSuccessMessage = enSuccessMessage;
    }
}