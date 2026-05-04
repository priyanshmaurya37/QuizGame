using System.ComponentModel.DataAnnotations;

namespace Quzi.Models
{
    public class StudentList
    {
        [Key]

        public int Id { get; set; }

        [Required(ErrorMessage ="Enter Name")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Enter Father Name")]
        public string Father { get; set; }

        [Required(ErrorMessage = "Enter Email")]
        public string Email {  get; set; }

        [Required(ErrorMessage = "Enter Mobile")]
        public string Mobile { get; set; }

        [Required(ErrorMessage = "Enter Dob")]
        public string Dob {  get; set; }

        [Required(ErrorMessage = "Enter Class")]
        public string Class {  get; set; }

        [Required(ErrorMessage = "Enter Address")]
        public string Address { get; set; }

        //[Required(ErrorMessage = "Enter Image")]
        public string Image {  get; set; }

        public DateTime Date { get; set; }= DateTime.Now;
    }
}
