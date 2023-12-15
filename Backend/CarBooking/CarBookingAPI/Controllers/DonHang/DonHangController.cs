using AutoMapper;
using CarBookingDomain.DTO.DonHang;
using CarBookingDomain.ViewModels.DonHang;
using CarBookingServices.Interfaces;
using CarBookingServices.Services.DonHang;
using CarBookingServices.Services.SignalR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CarBookingAPI.Controllers.DonHang
{
    [ApiController]
    [Route("[controller]")]
    public class DonHangController : ControllerBase
    {
        private readonly IHubContext<SignalRService> _hubContext;
        private readonly IDonHangService _donHangService;
        private readonly IMapper _iMapper;

        public DonHangController(IMapper iMapper, IDonHangService donHangService, IHubContext<SignalRService> hubContext)
        {
            _iMapper = iMapper;
            _donHangService = donHangService;
            _hubContext = hubContext;
        }

        [HttpPost]
        [Route("TaoDonHang")]
        [SwaggerOperation(Summary = "Loại khách hàng = 0 là khách hàng thường, loại khách hàng = 1 là khách hàng vip." +
            "Trạng thái đơn hàng. 0 là thất bại, 1 là thành công, 2 là đang thực hiện." +
            "Loại tài khoản = 0 là tài xế, loại tài khoản = 1 là khách hàng.")]
        [Authorize]

        public async Task<IActionResult> TaoDonHangAsync(TaoDonHangVM donHang)
        {
            SignalRService.DonHangThatBai = false;
            SignalRService.TaiXeChapNhan = false;
            if (donHang.ThoiGianDon == DateTime.MinValue)
            {
                donHang.ThoiGianDon = null;
            }
            var timeout = TimeSpan.FromSeconds(120);
            var cancellationToken = new CancellationTokenSource(timeout);

            try
            {
                var chiTietDonHangDto = await _donHangService.ChuanBiDonHang(donHang);
                var chiTietDonHang = _iMapper.Map<ChiTietDonHangDTO, ChiTietDonHangVM>(chiTietDonHangDto);

                // broadcast thong tin don hang cho tai xe
                SignalRService.GuiChiTietDonHangChoTaiXe(chiTietDonHang);
                await _hubContext.Clients.All.SendAsync("ReceiveMessage", SignalRService.ChiTietKhachHangDonHang);

                // cho tai xe chap nhan don hang
                var taiXeChapNhan = await SignalRService.ChoTaiXeChapNhan();

                // cap nhat thong tin tai xe neu co thay doi
                var ThongTinDonHangChinhThuc = JObject.Parse(SignalRService.ChiTietKhachHangDonHang);
                chiTietDonHang.TenTaiXe = ThongTinDonHangChinhThuc["TenTaiXe"].ToString();
                chiTietDonHang.SoDienThoaiTaiXe = ThongTinDonHangChinhThuc["SoDienThoaiTaiXe"].ToString();
                chiTietDonHang.BienSoXe = ThongTinDonHangChinhThuc["BienSoXe"].ToString();

                cancellationToken.Token.ThrowIfCancellationRequested();
                if (taiXeChapNhan)
                {
                    return Ok(chiTietDonHang);
                }
                return Problem("Đơn hàng bị huỷ do không tìm thấy tài xế");
            }

            catch (OperationCanceledException)
            {
                SignalRService.DonHangThatBai = true;
                DonHangService.DonHangDangXuLy = null;
                SignalRService.ChiTietKhachHangDonHang = string.Empty;
                return Problem("Tất cả tài xế đều đang bận");
            }
        }
    }
}
