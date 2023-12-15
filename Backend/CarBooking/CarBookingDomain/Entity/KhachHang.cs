using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarBookingDomain.Entity
{
    public class KhachHang
    {
        [Key]
        public int IdKhachHang { get; set; }

        [ForeignKey("TaiKhoan")]
        public string SoDienThoai { get; set; }
        public TaiKhoan TaiKhoan { get; set; }
        public int LoaiKhachHang { get; set; }
        public string HoTen { get; set; }
    }
}
