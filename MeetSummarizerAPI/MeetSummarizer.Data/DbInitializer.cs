using MeetSummarizer.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeetSummarizer.Data
{

namespace MeetSummarizer.Data
    {
        public static class DbInitializer
        {
            public static void Initialize(IServiceProvider serviceProvider)
            {
                using var scope = serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<DataContext>();

                // ודא שהמסד קיים
                context.Database.Migrate();

                // בדוק אם קיים אדמין
                if (!context.Users.Any(u => u.RoleId == 21 ))
                {
                    // צור אדמין ברירת מחדל
                    var adminUser = new User
                    {
                        UserName = "admin",
                        Password = "admin123", // לא לשכוח להחליף לסיסמה מוצפנת בפרויקט אמיתי!
                        RoleId = 21
                    };

                    context.Users.Add(adminUser);
                    context.SaveChanges();
                }
            }
        }
    }

}

