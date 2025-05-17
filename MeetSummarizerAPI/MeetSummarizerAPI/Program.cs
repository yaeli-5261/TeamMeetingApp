using MeetSummarizer.Core.Interfaces;
using MeetSummarizer.Core.IRepository;
using MeetSummarizer.Core.IServices;
using MeetSummarizer.Core.Mapping;
using MeetSummarizer.Core.Services;
using MeetSummarizer.Data.Repositories;
using MeetSummarizer.Service;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Amazon.S3;
using Amazon.Runtime;
using System.Text.Json.Serialization;
using MeetSummarizer.Data.MeetSummarizer.Data;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSingleton<IAmazonS3>(provider => {
    var configuration = provider.GetRequiredService<IConfiguration>();
    var awsOptions = configuration.GetSection("AWS");

    var accessKey = awsOptions["AccessKey"] ?? Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID");
    var secretKey = awsOptions["SecretKey"] ?? Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY");
    var region = awsOptions["Region"] ?? Environment.GetEnvironmentVariable("AWS_REGION") ?? "eu-north-1";

    return new AmazonS3Client(accessKey, secretKey, Amazon.RegionEndpoint.GetBySystemName(region));
});

builder.Services.AddSwaggerGen(c =>
{
    // הגדרת ה-Security Definition עבור Bearer Token
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Please enter your JWT token"
    });

    // הגדרת ה-Security Requirement כדי להחיל את הטוקן על כל הבקשות
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddScoped<IMeetingService, MeetingService>();
builder.Services.AddScoped<IMeetingRepository, MeetingRepository>();

builder.Services.AddScoped<IRoleService ,RoleService> ();
builder.Services.AddScoped<IRoleRepository , RoleRepository>();

builder.Services.AddScoped<ITeamService, TeamService>();
builder.Services.AddScoped<ITeamRepository, TeamRepository>();


builder.Services.AddScoped<IManagerRepository, ManagerRepository>();
builder.Services.AddScoped<AuthService>();

builder.Services.AddAWSService<IAmazonS3>(); // הוספת שירות ה-AWS S3
builder.Services.AddScoped<S3Service>();
//Mapper
builder.Services.AddAutoMapper(typeof(MappingProfile));
//////
builder.Services.AddHttpClient();
//// הוספת JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})

.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});
//todo


// קריאה לאתחול מסד הנתונים
//using (var scope = app.Services.CreateScope())
//{
//    var services = scope.ServiceProvider;
//    DbInitializer.Initialize(services);
//}

//

// הוספת הרשאות מבוססות-תפקידים
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("AdminAndWorker", policy => policy.RequireRole("Worker", "Admin"));
});
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});
var app = builder.Build();





//AWS
//var accessKey = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID", EnvironmentVariableTarget.User);
//var secretKey = Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY", EnvironmentVariableTarget.User);
//var awsRegion = Environment.GetEnvironmentVariable("AWS_REGION", EnvironmentVariableTarget.User);

//if (string.IsNullOrEmpty(accessKey) || string.IsNullOrEmpty(secretKey) || string.IsNullOrEmpty(awsRegion))
//{
//    throw new Exception("Missing AWS credentials in environment variables");
//}

//var credentials = new BasicAWSCredentials(accessKey, secretKey);
//var region = Amazon.RegionEndpoint.GetBySystemName(awsRegion);

//var s3Client = new AmazonS3Client(credentials, region);
//builder.Services.AddSingleton<IAmazonS3>(s3Client);

//Console.WriteLine("S3 Client initialized successfully.");

//var app = builder.Build();
app.UseDeveloperExceptionPage();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage(); // ✅ מציג שגיאות מפורטות
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

//ריאקט
app.UseCors("AllowAllOrigins");

// הפעלת אימות והרשאות
app.UseAuthentication();//JWT

app.UseAuthorization();

app.MapControllers();

app.Run();
