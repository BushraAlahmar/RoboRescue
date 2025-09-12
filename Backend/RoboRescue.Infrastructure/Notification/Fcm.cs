using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;
using RoboRescue.Application.Abstractions;

namespace RoboRescue.Infrastructure.Notification;

public class Fcm : IFcm
{
    private readonly FirebaseMessaging _messaging;

    public Fcm()
    {
        var app = FirebaseApp.DefaultInstance;
        if (FirebaseApp.DefaultInstance == null)
        {
            app = FirebaseApp.Create(new AppOptions()
            {
                Credential = GoogleCredential.FromFile(Path.Combine(AppContext.BaseDirectory, "fcm", "FCM.json"))
                    .CreateScoped("https://www.googleapis.com/auth/firebase.messaging")
            });
        }

        _messaging = FirebaseMessaging.GetMessaging(app);
    }

    public async Task NotifyUsingToken(string title, string body, string token)
    {
        var message = new Message
        {
            Data = new Dictionary<string, string>
            {
                { "myData", "1337" },
            },
            Token = token,
            Notification = new FirebaseAdmin.Messaging.Notification
            {
                Title = title,
                Body = body,
            }
        };
        // Send a message to the device corresponding to the provided
        // registration token.
        var response = await _messaging.SendAsync(message);
        // Response is a message ID string.
        Console.WriteLine("Successfully sent message: " + response);
    }

    public async Task NotifyUsingTopic(string title, string body, string topic)
    {
        var message = new Message
        {
            Data = new Dictionary<string, string>
            {
                { "myData", "1337" },
            },
            Topic = topic,
            Notification = new FirebaseAdmin.Messaging.Notification
            {
                Title = title,
                Body = body,
            }
        };
        // Send a message to the device corresponding to the provided
        // registration token.
        var response = await _messaging.SendAsync(message);
        // Response is a message ID string.
        Console.WriteLine("Successfully sent message: " + response);
    }
}