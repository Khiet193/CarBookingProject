namespace CarBookingDomain.ViewModels.TaiKhoan
{
    public class ThongTinTaiKhoanVM
    {
        public string SoDienThoai { get; set; }

        // LoaiTaiKhoan = 0 la tai xe, LoaiTaiKhoan = 1 khach hang
        public int LoaiTaiKhoan { get; set; }
        public string HoTen { get; set; }

        // loaiKhachHang = 1 la khach hang thuong, loaiKhachHang = 2 la vip
        public int? LoaiKhachHang { get; set; }
        public string BienSoXe { get; set; }
    }
}