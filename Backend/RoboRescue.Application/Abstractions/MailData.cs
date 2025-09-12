namespace RoboRescue.Application.Abstractions;

public class MailData
{
    public string Title { get; set; } = null!;
    public string Content { get; set; } = null!;
    public string? ReceiverId { get; set; }
    public string ReceiverName { get; set; } = null!;
    public string EmailSubject { get; set; } = null!;
    public string EmailBody { get; set; } = null!;
}