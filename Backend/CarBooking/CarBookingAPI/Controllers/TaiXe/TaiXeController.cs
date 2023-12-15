using AutoMapper;
using CarBookingDomain.DTO.DonHang;
using CarBookingDomain.DTO.TaiXe;
using CarBookingDomain.ViewModels.DonHang;
using CarBookingDomain.ViewModels.TaiXe;
using CarBookingServices.Interfaces;
using CarBookingServices.Services.DonHang;
using CarBookingServices.Services.SignalR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System.Threading.Tasks;

namespace CarBookingAPI.Controllers.TaiXe
{
    [ApiController]
    [Route("[controller]")]
    public class TaiXeController : Controller
    {
        private readonly IDonHangService _donHangService;
        private readonly ITaiXeService _taiXeService;
        private readonly IHubContext<SignalRService> _hubContext;
        private readonly IMapper _iMapper;
        public TaiXeController(ITaiXeService taiXeService, IMapper iMapper, IDonHangService donHangService, IHubContext<SignalRService> hubContext)
        {
            _iMapper = iMapper;
            _taiXeService = taiXeService;
            _donHangService = donHangService;
            _hubContext = hubContext;
        }

        [HttpPost]
        [Route("CapNhatViTri")]
        [Authorize]
        public IActionResult CapNhatViTri(ViTriTaiXeVM viTriTaiXeVM)
        {
            var viTriTaiXeDto = _iMapper.Map<ViTriTaiXeVM, ViTriTaiXeDTO>(viTriTaiXeVM);
            var luuThanhCong = _taiXeService.LuuThongTinViTriTaiXe(viTriTaiXeDto);

            if (luuThanhCong)
            {
                return Ok("Lưu vị trí thành công");
            }
            return BadRequest("Lưu vị trí không thành công");
        }

        [HttpPost]
        [Route("ChapNhanDonHang")]
        [Authorize]
        public IActionResult ChapNhanDonHang(string soDienThoaiTaiXe)
        {
            // xoa tai xe khoi message queue
            if (SignalRService.DonHangThatBai == false)
            {
                SignalRService.TaiXeChapNhan = true;
                _taiXeService.XoaTaiXeKhoiMessageQueue(soDienThoaiTaiXe);
                if (DonHangService.DonHangDangXuLy != null)
                {
                    return Ok("Đã chấp nhận đơn hàng");
                }
            }

            return BadRequest("Đơn hàng đã hết thời gian chờ");
        }

        [HttpPost]
        [Route("TuChoiDonHang")]
        [Authorize]
        public async Task<IActionResult> TuChoiDonHangAsync(string soDienThoaiTaiXe)
        {
            // xoa tai xe khoi message queue
            _taiXeService.XoaTaiXeKhoiMessageQueue(soDienThoaiTaiXe);

            // bat dau lai qua trinh tim tai xe
            if (DonHangService.DonHangDangXuLy != null)
            {
                var chiTietDonHangDto = await _donHangService.ChuanBiDonHang(DonHangService.DonHangDangXuLy);
                if (chiTietDonHangDto != null)
                {
                    var chiTietDonHang = _iMapper.Map<ChiTietDonHangDTO, ChiTietDonHangVM>(chiTietDonHangDto);

                    // broadcast thong tin don hang cho tai xe
                    SignalRService.GuiChiTietDonHangChoTaiXe(chiTietDonHang);
                }
            }

            return Ok("Đã từ chối đơn hàng");
        }

        [HttpPost]
        [Route("TaiXeHuyDon")]
        [Authorize]
        public async Task<IActionResult> TaiXeHuyDonAsync(ChiTietDonHangVM chiTietDonHang)
        {
            // trang thai = 0 nghia la don hang that bai, trang thai = 1 nghia la don hang thanh cong
            SignalRService.ChiTietKhachHangDonHang = string.Empty;
            chiTietDonHang.TrangThai = 0;
            var chiTietDonHangDto = _iMapper.Map<ChiTietDonHangVM, ChiTietDonHangDTO>(chiTietDonHang);
            await _donHangService.LuuLichSuDonHang(chiTietDonHangDto);
            var messageHuyDonHang = JsonConvert.SerializeObject(chiTietDonHangDto);
            await _hubContext.Clients.All.SendAsync("ReceiveMessage", messageHuyDonHang);
            return Ok("Đã huỷ đơn");
        }

        [HttpPost]
        [Route("TaiXeHoanThanhChuyenDi")]
        [Authorize]
        public async Task<IActionResult> TaiXeHoanThanhChuyenDiAsync(ChiTietDonHangVM chiTietDonHang)
        {
            // trang thai = 0 nghia la don hang that bai, trang thai = 1 nghia la don hang thanh cong
            SignalRService.ChiTietKhachHangDonHang = string.Empty;
            chiTietDonHang.TrangThai = 1;
            var chiTietDonHangDto = _iMapper.Map<ChiTietDonHangVM, ChiTietDonHangDTO>(chiTietDonHang);
            await _donHangService.LuuLichSuDonHang(chiTietDonHangDto);
            var messageHoanThanhDonHang = JsonConvert.SerializeObject(chiTietDonHangDto);
            await _hubContext.Clients.All.SendAsync("ReceiveMessage", messageHoanThanhDonHang);
            return Ok("Chuyến đi đã hoàn thành");
        }
    }
}