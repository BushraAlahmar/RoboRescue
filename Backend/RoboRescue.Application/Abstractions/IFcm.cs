namespace RoboRescue.Application.Abstractions;

public interface IFcm
{
    Task NotifyUsingToken(string title, string body, string token);
    Task NotifyUsingTopic(string title, string body, string token);
}