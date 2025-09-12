using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using RoboRescue.Application.Abstractions;
using RoboRescue.Infrastructure.Templates;

namespace RoboRescue.Infrastructure.Mail;

public class MailSender : IMailSender
{
    private readonly MailSettings _mailSettings;

    public MailSender(IOptions<MailSettings> mailSettingsOptions)
    {
        _mailSettings = mailSettingsOptions.Value;
    }

    public bool SendMail(MailData mailData)
    {
        try
        {
             using var emailMessage = new MimeMessage();
            var emailFrom = new MailboxAddress(_mailSettings.SenderName, _mailSettings.SenderEmail);
            emailMessage.From.Add(emailFrom);
            var emailTo = new MailboxAddress(mailData.ReceiverName, mailData.ReceiverId);
            emailMessage.To.Add(emailTo);

            emailMessage.Cc.Add(new MailboxAddress("Cc Receiver", "cc@example.com"));
            emailMessage.Bcc.Add(new MailboxAddress("Bcc Receiver", "bcc@example.com"));

            emailMessage.Subject = mailData.EmailSubject;

            var body = Email.EmailTemplate(mailData.Title, mailData.Content, mailData.ReceiverName,mailData.EmailBody);

            var emailBodyBuilder = new BodyBuilder
            {
                HtmlBody = body
            };
            emailMessage.Body = emailBodyBuilder.ToMessageBody();
            //this is the SmtpClient from the Mailkit.Net.Smtp namespace, not the System.Net.Mail one
            using var mailClient = new SmtpClient();
            mailClient.Connect(_mailSettings.Server, _mailSettings.Port,
                MailKit.Security.SecureSocketOptions.StartTls);
            mailClient.Authenticate(_mailSettings.SenderEmail, _mailSettings.Password);
            mailClient.Send(emailMessage);
            mailClient.Disconnect(true);

            return true;
        }
        catch (Exception ex)
        {
            return false;
        }
    }
}