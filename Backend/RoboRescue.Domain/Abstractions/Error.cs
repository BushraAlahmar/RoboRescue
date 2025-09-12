namespace RoboRescue.Domain.Abstractions;

public enum Error
{
    None,
    NullValue,
    ServerError,
    IncorrectCredentials,
    NotVerified,
    NumberIsExist,
    LevelNumberIsExist,
    LevelPassedBefore,
    EmailExists,
    UsernameExists,
    FinishAllTheSectionToReplay,
    ThisTaskIsSolvedBefore,
    Unknown
}