using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeetSummarizer.Core.Entities
{
    public class Meeting
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public int TeamId { get; set; }//קוד צוות
        public string LinkTranscriptFile { get; set; }
        public string LinkOrinignFile { get; set; }
    }

}

