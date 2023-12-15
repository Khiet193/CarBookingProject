using CarBookingDomain.DTO.DonHang;
using CarBookingDomain.DTO.TaiXe;
using CarBookingDomain.ViewModels.DonHang;
using System.Threading.Tasks;

namespace CarBookingServices.Interfaces
{
    public interface IDonHangService
    {
        ChiTietDonHangDTO TaoChiTietDonHang(TaiXeDTO taiXePhuHop, TaoDonHangDTO donHang);
        Task<ChiTietDonHangDTO> ChuanBiDonHang(TaoDonHangVM donHang);
        Task LuuLichSuDonHang(ChiTietDonHangDTO chiTietDonHang);
    }
}
