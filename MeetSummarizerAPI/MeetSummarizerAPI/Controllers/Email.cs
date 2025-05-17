using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace MeetingManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EmailController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailController> _logger;

        public EmailController(IConfiguration configuration, ILogger<EmailController> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("Send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {
            try
            {
                _logger.LogInformation($"Attempting to send email to {request.To}");

                // Get SMTP settings from configuration
                var smtpServer = _configuration["Email:SmtpServer"];
                var smtpPort = int.Parse(_configuration["Email:SmtpPort"]);
                var smtpUsername = _configuration["Email:Username"];
                var smtpPassword = _configuration["Email:Password"];
                var senderEmail = _configuration["Email:SenderEmail"];
                var senderName = _configuration["Email:SenderName"];

                // Validate configuration
                if (string.IsNullOrEmpty(smtpServer) || string.IsNullOrEmpty(smtpUsername) ||
                    string.IsNullOrEmpty(smtpPassword) || string.IsNullOrEmpty(senderEmail))
                {
                    _logger.LogError("Email configuration is incomplete");
                    return StatusCode(500, new { success = false, message = "Email service is not properly configured" });
                }

                // Create mail message
                var mailMessage = new MailMessage
                {
                    From = new MailAddress(senderEmail, senderName ?? "Meeting Manager"),
                    Subject = request.Subject,
                    Body = request.Body,
                    IsBodyHtml = request.IsHtml
                };

                mailMessage.To.Add(request.To);

                // Configure SMTP client
                var smtpClient = new SmtpClient(smtpServer)
                {
                    Port = smtpPort,
                    Credentials = new NetworkCredential(smtpUsername, smtpPassword),
                    EnableSsl = true
                };

                // Send email
                await smtpClient.SendMailAsync(mailMessage);

                _logger.LogInformation($"Email sent successfully to {request.To}");
                return Ok(new { success = true, message = "Email sent successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email: {ex.Message}");
                return StatusCode(500, new { success = false, message = $"Failed to send email: {ex.Message}" });
            }
        }
    }

    public class EmailRequest
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public bool IsHtml { get; set; } = false;
    }
}