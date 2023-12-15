using System;

namespace CarBookingDomain.ViewModels.DonHang
{
    public class TaoDonHangVM
    {
        public string SoDienThoaiKhachHang { get; set; }
        public string TenKhachHang { get; set; }
        public string DiemDon { get; set; }
        public string DiemDen { get; set; }
        public double LongitudeKhachHang { get; set; }
        public double LatitudeKhachHang { get; set; }
        public double LongitudeDiemDen { get; set; }
        public double LatitudeDiemDen { get; set; }
        public int LoaiKhachHang { get; set; } = 1;
        public DateTime? ThoiGianDon { get; set; }
        public DateTime GioDatXe { get; set; } = DateTime.Now;
    }
}
