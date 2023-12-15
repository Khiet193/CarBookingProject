namespace CarBookingDomain.ViewModels.KhachHang
{
    public class KhachHangVM
    {
        public string SoDienThoai { get; set; }
        public string HoTen { get; set; }

        // loaiKhachHang = 1 la khach hang thuong, loaiKhachHang = 2 la vip
        public int LoaiKhachHang { get; set; } = 1;
    }
}