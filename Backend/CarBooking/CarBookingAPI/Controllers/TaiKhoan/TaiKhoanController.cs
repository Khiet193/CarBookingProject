using AutoMapper;
using CarBookingDomain.DTO.TaiKhoan;
using CarBookingDomain.ViewModels.TaiKhoan;
using CarBookingServices.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CarBookingAPI.Controllers.TaiKhoan
{
    [ApiController]
    [Route("[controller]")]
    public class TaiKhoanController : ControllerBase
    {
        private readonly ITaiKhoanService _taiKhoanService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IMapper _iMapper;
        public TaiKhoanController(ITaiKhoanService taiKhoanService, IMapper iMapper, IAuthenticationService authenticationService)
        {
            _iMapper = iMapper;
            _taiKhoanService = taiKhoanService;
            _authenticationService = authenticationService;
        }

        [HttpPost]
        [Route("TaoTaiKhoan")]
        public async Task<IActionResult> TaoTaiKhoanAsync(TaiKhoanVM taiKhoanVM)
        {
            if (taiKhoanVM.SoDienThoai == string.Empty || taiKhoanVM.Password == string.Empty)
            {
                return BadRequest("Thông tin tài khoản không hợp lệ");
            }

            var taiKhoanHopLe = await _taiKhoanService.KiemTraTaiKhoanHopLeAsync(taiKhoanVM.SoDienThoai, taiKhoanVM.BienSoXe);
            if (taiKhoanHopLe == 1)
            {
                var taiKhoanDto = _iMapper.Map<TaiKhoanVM, TaiKhoanDTO>(taiKhoanVM);
                var thongTinTaiKhoanDto = await _taiKhoanService.TaoTaiKhoanAsync(taiKhoanDto);
                var thongTinTaiKhoan = _iMapper.Map<ThongTinTaiKhoanDTO, ThongTinTaiKhoanVM>(thongTinTaiKhoanDto);
                return Ok(thongTinTaiKhoan);
            }

            else if (taiKhoanHopLe == -1)
            {
                return BadRequest("Biển số xe đã được đăng ký bởi tài khoản khác");
            }

           return BadRequest("Số điện thoại đã tồn tại trong hệ thống");
        }

        [HttpPost]
        [Route("DangNhap")]
        public async Task<IActionResult> DangNhapAsync(ThongTinDangNhapVM taiKhoanDangNhap)
        {
            if (taiKhoanDangNhap.SoDienThoai == string.Empty || taiKhoanDangNhap.Password == string.Empty)
            {
                return BadRequest("Thông tin đăng nhập không hợp lệ");
            }

            var thongTinTaiKhoanDto = await _taiKhoanService.DangNhapAsync(taiKhoanDangNhap.SoDienThoai, taiKhoanDangNhap.Password, taiKhoanDangNhap.LoaiTaiKhoan);
            if (thongTinTaiKhoanDto == null)
            {
                return BadRequest("Thông tin tài khoản không tồn tại!");
            }

            var accessToken = "Bearer " + _authenticationService.GenerateToken(taiKhoanDangNhap.SoDienThoai);
            var thongTinTaiKhoan = _iMapper.Map<ThongTinTaiKhoanDTO, ThongTinTaiKhoanVM>(thongTinTaiKhoanDto);
            return Ok(new {accessToken, thongTinTaiKhoan});
        }
    }
}