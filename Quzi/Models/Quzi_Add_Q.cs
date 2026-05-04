using System.ComponentModel.DataAnnotations;

namespace Quzi.Models
{
    public class Quzi_Add_Q
    {
        [Key]

        public int Id { get; set; }

        
        public string Question_Text { get; set; } 
        public string Option_A { get; set; }
        public string Option_B { get; set; }
        public string Option_C { get; set; }
        public string Option_D { get; set; }
        public string Correct_Answer { get; set; }
        public string Target_Class { get; set; }
        public string Solution_Explanation { get; set; }
    }
}
