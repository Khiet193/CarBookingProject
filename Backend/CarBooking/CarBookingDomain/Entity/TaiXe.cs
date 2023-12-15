using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarBookingDomain.Entity
{
    public class TaiXe
    {
        [Key]
        public int IdTaiXe { get; set; }
        [ForeignKey("TaiKhoan")]
        public string SoDienThoai { get; set; }
        public TaiKhoan TaiKhoan { get; set; }
        public string HoTen { get; set; }
        public string BienSoXe { get; set; }
    }
}
