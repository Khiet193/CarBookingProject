using CarBookingDomain.Context;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CarBookingAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DeleteDataController : Controller
    {
        private readonly CarBookingDbContext _dbContext;

        public DeleteDataController(CarBookingDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpDelete]
        [Route("DeleteAllData")]
        public IActionResult DeleteAllData()
        {
            var TatCaDonHang = _dbContext.DonHang.ToList();
            _dbContext.DonHang.RemoveRange(TatCaDonHang);
            var TatCaKhachHang = _dbContext.KhachHang.ToList();
            _dbContext.KhachHang.RemoveRange(TatCaKhachHang);
            var TatCaTaiXe = _dbContext.TaiXe.ToList();
            _dbContext.TaiXe.RemoveRange(TatCaTaiXe);
            var TatCaTaiKhoan = _dbContext.TaiKhoan.ToList();
            _dbContext.TaiKhoan.RemoveRange(TatCaTaiKhoan);
            _dbContext.SaveChanges();
            return Ok("Đã xoá tất cả dữ liệu");
        }
    }
}
