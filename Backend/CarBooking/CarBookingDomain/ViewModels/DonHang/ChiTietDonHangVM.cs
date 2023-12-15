using System;

namespace CarBookingDomain.ViewModels.DonHang
{
    public class ChiTietDonHangVM
    {
        public string SoDienThoaiKhachHang { get; set; }
        public string TenKhachHang { get; set; }
        public string DiemDon { get; set; }
        public double LongitudeKhachHang { get; set; }
        public double LatitudeKhachHang { get; set; }
        public string DiemDen { get; set; }
        public double LongitudeDiemDen { get; set; }
        public double LatitudeDiemDen { get; set; }
        public DateTime ThoiGianDon { get; set; }
        public DateTime GioDatXe { get; set; }
        public decimal GiaTien { get; set; }
        public string TenTaiXe { get; set; }
        public string SoDienThoaiTaiXe { get; set; }
        public string BienSoXe { get; set; }
        public double LongitudeTaiXe { get; set; }
        public double LatitudeTaiXe { get; set; }
        public int TrangThai { get; set; }
    }
}