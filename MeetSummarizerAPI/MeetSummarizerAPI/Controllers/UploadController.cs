
using Amazon.S3;
using Amazon.S3.Model;
using MeetSummarizer.Core.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("api/upload")]
[Authorize]
public class UploadController : ControllerBase
{
    private readonly IAmazonS3 _s3Client;
    private S3Service S3Service;
    public UploadController(IAmazonS3 s3Client, S3Service s3Service)
    {
        _s3Client = s3Client;
        S3Service = s3Service;
    }

    [HttpGet("presigned-url")]
    public async Task<IActionResult> GetPresignedUrl([FromQuery] string fileName, [FromQuery] string contentType)
    {
        if (string.IsNullOrEmpty(fileName))
            return BadRequest("שם הקובץ נדרש");

        var request = new GetPreSignedUrlRequest
        {
            BucketName = "meet-summarizer-files",
            Key = fileName, // קבצים נשמרים בתיקיית exams
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddMinutes(2000),
            //ContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ContentType=contentType
        };
        try
        {
            var url = await S3Service.GeneratePresignedUrlAsync(fileName, contentType);

            //string url = _s3Client.GeneratePresignedUrlAsync(request);
            return Ok(new { url });
        }
        catch (AmazonS3Exception ex)
        {
            return StatusCode(500, $"Error generating presigned URL: {ex.Message}");
        }
    }
    //[HttpGet("download-url")]
    //public async Task<string> GetDownloadUrlAsync([FromBody] string fileName)
    //{
    //    var request = new GetPreSignedUrlRequest
    //    {
    //        BucketName = "meet-summarizer-files ",
    //        Key = fileName,
    //        Verb = HttpVerb.GET,
    //        Expires = DateTime.UtcNow.AddDays(300),
    //    };

    //    return _s3Client.GetPreSignedURL(request);
    //}


    // ⬇️ שלב 2: קבלת URL להורדת קובץ מה-S3
    [HttpGet("download-url")]
    public async Task<IActionResult> GetDownloadUrl([FromQuery] string fileName)
    {
        var url = await S3Service.GetDownloadUrlAsync(fileName);
        return Ok(new { downloadUrl = url });
    }
}

