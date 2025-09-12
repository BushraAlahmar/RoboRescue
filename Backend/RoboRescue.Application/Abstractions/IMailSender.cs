namespace RoboRescue.Application.Abstractions;

public interface IMailSender
{
    bool SendMail(MailData mailData);
}