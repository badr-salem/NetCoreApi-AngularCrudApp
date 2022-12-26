using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json.Linq;

namespace BookAPI.Controllers
{
    //[Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        [Route("api/[controller]")]
        [HttpPost , DisableRequestSizeLimit]
        public IActionResult Upload()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources" , "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory() , folderName);

                var extension = Path.GetExtension(file.FileName).ToLower();

                List<String> extensionlist = new List<String>();

                // Adding elements to List
                extensionlist.Add(".jpg");
                extensionlist.Add(".png");
                extensionlist.Add(".jpeg");
                extensionlist.Add(".jfif");

                if (extensionlist.Contains(extension) == false)
                {

                    return BadRequest();

                }

                    if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim().ToString();
                    //var newFileName = fileName + "-" + DateTime.Now.Day.ToString()+"-"+DateTime.Now.Month.ToString();

                    var newFileName = DateTime.Now.Day.ToString()+"-"+DateTime.Now.Millisecond+fileName;
                    var fullPath = Path.Combine(pathToSave, newFileName);
                    var dbPath = Path.Combine(folderName, newFileName);

                    using(var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }


                    return Ok(new {dbPath});
                }
                else
                {
                    return BadRequest();
                }

            }
            catch(Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex}");
            }
        }


        //[HttpPost("api/UnUpload/{imagePath}")]
        [HttpPost]
        [Route("api/[action]/{imagePath}")]
        public IActionResult UnUpload(string imagePath)
        {
            try
            {

                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);


                var filePath = Path.Combine(pathToSave, imagePath.TrimStart('\\'));

                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    return Ok();
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex}");
            }
        }


    }
}
