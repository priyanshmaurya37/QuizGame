using Microsoft.AspNetCore.Mvc;
using Quzi.Models;

namespace Quzi.Controllers
{
    public class StudentMasterController : Controller
    {
        private readonly DatabaseConnection con;
        private readonly IWebHostEnvironment env;
        public StudentMasterController(DatabaseConnection con, IWebHostEnvironment env)
        {
            this.con = con;
            this.env = env;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Index(StudentList data, IFormFile Image)
        {
            if (ModelState == null)
            {
                return View(data);
            }
            var exitdata = con.StudentList.FirstOrDefault(x => x.Email == data.Email || x.Mobile == data.Mobile);

            if (exitdata != null)
            {
                TempData["error"] = "Email or Mobile already exist";
                return RedirectToAction("Index");
            }

            string folderpath = Path.Combine(env.WebRootPath, "ImageKit");

                if (!Directory.Exists(folderpath))
                {
                    Directory.CreateDirectory(folderpath);
                }

                string filename = Guid.NewGuid().ToString() + Path.GetExtension(Image.FileName);
                string filepath = Path.Combine(folderpath, filename);

                using (var file = new FileStream(filepath, FileMode.Create))
                {
                    await Image.CopyToAsync(file);
                }

                data.Image = filename;
            

            con.StudentList.Add(data);
            await con.SaveChangesAsync();

            return RedirectToAction("Stu_Login");
        }
        public IActionResult StudentList()
        {
            var data = con.StudentList.ToList();
            return View(data);
        }


        public IActionResult Stu_Login()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Stu_Login(StudentList data)
        {
            var exitsdata = con.StudentList.FirstOrDefault(x=>x.Email == data.Email && x.Mobile == data.Mobile);
            if(exitsdata != null)
            {
                HttpContext.Session.SetString("Admin",data.Email);
                return RedirectToAction("StudentQuiz","Quzi");
            }
            else
            {
                TempData["error"] = "Login Failed";
                return RedirectToAction("Stu_Login");
            }
        }
    }
}
