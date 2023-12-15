using CarBookingDomain.DTO.TaiKhoan;
using System.Threading.Tasks;

namespace CarBookingServices.Interfaces
{
    public interface ITaiKhoanService
    {
        Task<ThongTinTaiKhoanDTO> TaoTaiKhoanAsync(TaiKhoanDTO taiKhoan);
        Task<ThongTinTaiKhoanDTO> DangNhapAsync(string soDienThoai, string password, int loaiTaiKhoan);
        Task<int> KiemTraTaiKhoanHopLeAsync(string soDienThoai, string bienSoXe);
    }
}