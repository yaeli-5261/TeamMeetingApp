//using Amazon.S3.Model;
//using Amazon.S3;
//using Microsoft.AspNetCore.Mvc;

//namespace MeetSummarizerAPI
//{
//    [ApiController]
//    [Route("api/file")]
//    public class FileController : ControllerBase
//    {
//        private readonly IAmazonS3 _s3Client;
//        private readonly string _bucketName;

//        public FileController(IAmazonS3 s3Client, IConfiguration config)
//        {
//            _s3Client = s3Client;
//            _bucketName = config["AWS:BucketName"];  // להגדיר ב-appsettings.json
//        }

//        [HttpGet("generate-presigned-url")]
//        public IActionResult GeneratePresignedUrl([FromQuery] string fileName)
//        {
//            //var request = new GetPreSignedUrlRequest
//            //{
//            //    BucketName = _bucketName,
//            //    Key = fileName,
//            //    Verb = HttpVerb.PUT,
//            //    Expires = DateTime.UtcNow.AddMinutes(15),
//            //    ContentType = "application/octet-stream"
//            //};
//            if (string.IsNullOrEmpty(fileName))
//                return BadRequest("Missing userId or fileName");

//            var url =  _s3Client.GetPreSignedURL(fileName);
//            return Ok(new { url });

//            //string presignedUrl = _s3Client.GetPreSignedURL(request);
//            //return Ok(new { url = presignedUrl });
//        }
//    }
//}
