﻿namespace CarBookingDomain.ViewModels.TaiKhoan
{
    public class TaiKhoanVM
    {
        public string SoDienThoai { get; set; }
        public string Password { get; set; }

        // LoaiTaiKhoan = 0 la tai xe, LoaiTaiKhoan = 1 khach hang
        public int LoaiTaiKhoan { get; set; }
        public string HoTen { get; set; }
        public string BienSoXe { get; set; }
    }
}