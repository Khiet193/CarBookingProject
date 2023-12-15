using System.ComponentModel.DataAnnotations;

namespace CarBookingDomain.Entity
{
    public class TaiKhoan
    {
        [Key]
        public string SoDienThoai { get; set; }
        public string Password { get; set; }

        // LoaiTaiKhoan = 0 la tai xe, LoaiTaiKhoan = 1 khach hang
        public int LoaiTaiKhoan { get; set; }
    }
}
