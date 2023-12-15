namespace CarBookingDomain.DTO.TaiKhoan
{
    public class ThongTinTaiKhoanDTO
    {
        public string SoDienThoai { get; set; }

        // LoaiTaiKhoan = 0 la tai xe, LoaiTaiKhoan = 1 khach hang
        public int LoaiTaiKhoan { get; set; }
        public string HoTen { get; set; }
        public string BienSoXe { get; set; }
        public int? LoaiKhachHang { get; set; }
    }
}