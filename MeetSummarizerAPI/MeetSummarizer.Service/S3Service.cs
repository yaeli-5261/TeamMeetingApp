using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;
using System;
using System.Drawing;
using System.IO;
using System.Threading.Tasks;

public class S3Service
{
    private readonly IAmazonS3 _s3Client;

    public S3Service(IConfiguration configuration)
    {
        var awsOptions = configuration.GetSection("AWS");
        var name = awsOptions["BucketName"];
        var accessKey = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID", EnvironmentVariableTarget.User);
        var secretKey = Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY", EnvironmentVariableTarget.User);
        var awsRegion = Environment.GetEnvironmentVariable("AWS_REGION", EnvironmentVariableTarget.User);
        _s3Client = new AmazonS3Client(accessKey, secretKey, Amazon.RegionEndpoint.GetBySystemName(awsRegion));
    }
    public async Task<string> GeneratePresignedUrlAsync(string fileName, string contentType)
    {
        var key = fileName; // נתיב כולל תיקיה

        var request = new GetPreSignedUrlRequest
        {
            BucketName = "meet-summarizer-files",
            Key = key,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddMinutes(60),
            ContentType = contentType
            //ContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        };

        return _s3Client.GetPreSignedURL(request);
    }

    public async Task<string> GetDownloadUrlAsync(string fileName)
    {
        var key = fileName; // נתיב כולל תיקיה

        var request = new GetPreSignedUrlRequest
        {
            BucketName = "meet-summarizer-files",
            Key = key,
            Verb = HttpVerb.GET,
            Expires = DateTime.UtcNow.AddMinutes(60) // תוקף של שעה
        };

        return _s3Client.GetPreSignedURL(request);
    }

}

