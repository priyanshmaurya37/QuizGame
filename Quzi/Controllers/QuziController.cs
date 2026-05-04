using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Quzi.Models;

namespace Quzi.Controllers
{
    public class QuziController : Controller
    {
        private readonly DatabaseConnection con;
        public QuziController(DatabaseConnection con)
        {
            this.con= con;
        }

        //public override void OnActionExecuting(ActionExecutingContext conte
        //xt)
        //{
        //    if (HttpContext.Session.GetString("Admin") == null)
        //    {
        //        context.Result = RedirectToAction("Stu_Login", "StudentMaster");
        //    }
        //}

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult AdminQuiz()
        {
            var data = con.Quzi_Add_Q.ToList();
            return View(data);
        }
        [HttpPost]
        public IActionResult AdminQuiz(Quzi_Add_Q data)
        {
            con.Quzi_Add_Q.Add(data);
            con.SaveChanges();
            return RedirectToAction("All_Q_Quiz");
        }

        public IActionResult All_Q_Quiz()
        {
            var data = con.Quzi_Add_Q.ToList();
            return View(data);
        }

       

        public IActionResult StudentQuiz()
        {
            var admin = HttpContext.Session.GetString("Admin");

            if (string.IsNullOrEmpty(admin))
            {
                return RedirectToAction("Stu_Login", "StudentMaster");
            }
            var data = con.Quzi_Add_Q.ToList();
            return View(data);
        }
    }
}
