//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Text;
//using System.Text.Json;
//using System.Threading.Tasks;

//namespace MeetSummarizerAPI.Controllers
//{

//    [ApiController]
//    [Route("api/[controller]")]
//    //[Authorize]
//    public class FileController : ControllerBase
//    {
//        private readonly IHttpClientFactory _httpClientFactory;
//        private readonly IConfiguration _configuration;

//        public FileController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
//        {
//            _httpClientFactory = httpClientFactory;
//            _configuration = configuration;
//        }

//        [HttpPost("summarize")]
//        public async Task<IActionResult> SummarizeMeeting([FromBody] SummarizeRequest request)
//        {
//            if (string.IsNullOrEmpty(request.FileUrl))
//                return BadRequest("File URL is required");

//            var client = _httpClientFactory.CreateClient();
//            client.BaseAddress = new Uri(_configuration["PythonServer:BaseUrl"]); // למשל https://localhost:8000/

//            //// הוספת טוקן Authorization אם צריך
//            var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoieUB5IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIxMzYiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJEZXZlbG9wTWVuIiwiZXhwIjoxNzQ2MDc2MDgzLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MjE0IiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzIxNCJ9.f0z-bVgae05VczWxf0aN_SwwL2FlNMkTrPnVr-YIqkA";
//            if (!string.IsNullOrEmpty(token))
//            {
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token.Replace("Bearer ", ""));
//            }

//            var body = new
//            {
//                file_url = request.FileUrl
//            };

//            var jsonBody = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

//            try
//            {

//                var response = await client.PostAsync("process-file", jsonBody);

//                if (response.IsSuccessStatusCode)
//                {
//                    var responseContent = await response.Content.ReadAsStringAsync();
//                    return Ok(JsonSerializer.Deserialize<object>(responseContent));
//                }
//                else
//                {
//                    return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
//                }
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, $"Error communicating with Python server: {ex.Message}");
//            }
//        }
//    }

//    public class SummarizeRequest
//    {
//        public string FileUrl { get; set; }
//    }


//}

