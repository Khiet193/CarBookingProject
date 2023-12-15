using System;
using System.ComponentModel.DataAnnotations;

namespace CarBookingDomain.Entity
{
    public class DonHang
    {
        [Key]
        public int IdDonHang { get; set; }
        public int IdKhachHang { get; set; }
        public int IdTaiXe { get; set; }
        public decimal GiaTien { get; set; }
        public string DiemDon { get; set; }
        public string DiemDen { get; set; }
        public DateTime GioDatXe { get; set; }
        public int TrangThai { get; set; }
        public DateTime ThoiGianDon { get; set; }
    }
}
