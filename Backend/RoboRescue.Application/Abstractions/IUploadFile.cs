using Microsoft.AspNetCore.Http;

namespace RoboRescue.Application.Abstractions;

public interface UploadFile
{
    Task<string?> UImage(IFormFile img, string folder);
}