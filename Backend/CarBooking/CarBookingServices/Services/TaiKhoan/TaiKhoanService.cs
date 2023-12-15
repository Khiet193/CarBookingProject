using System.Threading.Tasks;
using CarBookingDomain.Context;
using CarBookingDomain.DTO.TaiKhoan;
using CarBookingDomain.Entity;
using CarBookingServices.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CarBookingServices.Services.TaiKhoan
{
    public class TaiKhoanService : ITaiKhoanService
    {
        private readonly CarBookingDbContext _dbContext;

        public TaiKhoanService(CarBookingDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ThongTinTaiKhoanDTO> TaoTaiKhoanAsync(TaiKhoanDTO taiKhoanDto)
        {
            var taiXe = new CarBookingDomain.Entity.TaiXe();
            var khachHang = new KhachHang();
            var taiKhoan = new CarBookingDomain.Entity.TaiKhoan
            {
                SoDienThoai = taiKhoanDto.SoDienThoai,
                Password = taiKhoanDto.Password,
                LoaiTaiKhoan = taiKhoanDto.LoaiTaiKhoan
            };

            _dbContext.TaiKhoan.Add(taiKhoan);
            if (taiKhoan.LoaiTaiKhoan == 0)
            {
                taiXe.SoDienThoai = taiKhoanDto.SoDienThoai;
                taiXe.HoTen = taiKhoanDto.HoTen;
                taiXe.BienSoXe = taiKhoanDto.BienSoXe;
                _dbContext.TaiXe.Add(taiXe);
            }

            else
            {
                khachHang.SoDienThoai = taiKhoanDto.SoDienThoai;
                khachHang.HoTen = taiKhoanDto.HoTen;
                khachHang.LoaiKhachHang = 0;
                khachHang.TaiKhoan = taiKhoan;
                _dbContext.KhachHang.Add(khachHang);
            }

            await _dbContext.SaveChangesAsync();

            var thongTinTaiKhoan = new ThongTinTaiKhoanDTO
            {
                BienSoXe = taiXe.BienSoXe,
                HoTen = taiKhoanDto.HoTen,
                SoDienThoai = taiKhoan.SoDienThoai,
                LoaiKhachHang = khachHang.LoaiKhachHang,
                LoaiTaiKhoan = taiKhoan.LoaiTaiKhoan
            };
            return thongTinTaiKhoan;
        }

        public async Task<ThongTinTaiKhoanDTO> DangNhapAsync(string soDienThoai, string password, int loaiTaiKhoan)
        {
            var taiKhoan = await _dbContext.TaiKhoan
                .FirstOrDefaultAsync(tk => tk.SoDienThoai == soDienThoai && tk.Password == password && tk.LoaiTaiKhoan == loaiTaiKhoan);

            if (taiKhoan == null)
                return null;

            var thongTinTaiKhoan = new ThongTinTaiKhoanDTO();

            // Tai xe
            if (taiKhoan.LoaiTaiKhoan == 0)
            {
                var taiXe = await _dbContext.TaiXe.FirstOrDefaultAsync(tx => tx.SoDienThoai == soDienThoai);
                if (taiXe != null)
                {
                    thongTinTaiKhoan.BienSoXe = taiXe.BienSoXe;
                    thongTinTaiKhoan.HoTen = taiXe.HoTen;
                    thongTinTaiKhoan.LoaiTaiKhoan = taiKhoan.LoaiTaiKhoan;
                    thongTinTaiKhoan.SoDienThoai = taiKhoan.SoDienThoai;
                }
                else
                {
                    return null;
                }
            }

            // Khach Hang
            else
            {
                var khachHang = await _dbContext.KhachHang.FirstOrDefaultAsync(kh => kh.SoDienThoai == soDienThoai);
                if (khachHang != null)
                {
                    thongTinTaiKhoan.HoTen = khachHang.HoTen;
                    thongTinTaiKhoan.LoaiTaiKhoan = taiKhoan.LoaiTaiKhoan;
                    thongTinTaiKhoan.SoDienThoai = taiKhoan.SoDienThoai;
                    thongTinTaiKhoan.LoaiKhachHang = khachHang.LoaiKhachHang;
                }
                else
                {
                    return null;
                }
            }

            return thongTinTaiKhoan;
        }

        public async Task<int> KiemTraTaiKhoanHopLeAsync(string soDienThoai, string bienSoXeTaiXe)
        {
            var taiKhoan = await _dbContext.TaiKhoan.FirstOrDefaultAsync(tk => tk.SoDienThoai == soDienThoai);

            if (taiKhoan == null)
            {
                var bienSoXe = await _dbContext.TaiXe.FirstOrDefaultAsync(tx => bienSoXeTaiXe != string.Empty && tx.BienSoXe == bienSoXeTaiXe);
                if (bienSoXe != null)
                {
                    return -1;
                }

                return 1;
            }

            return 0;
        }
    }
}