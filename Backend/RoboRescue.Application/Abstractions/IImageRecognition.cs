using RoboRescue.Domain.Abstractions;

namespace RoboRescue.Application.Abstractions;

public interface IImageRecognition
{
    Result<Guid> CompareFaces(string imagesPath, string imagePath);
}