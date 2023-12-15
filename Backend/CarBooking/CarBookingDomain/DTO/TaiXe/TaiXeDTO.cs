using System;

namespace CarBookingDomain.DTO.TaiXe
{
    public class TaiXeDTO
    {
        public string SoDienThoai { get; set; }
        public string HoTen { get; set; }
        public string BienSoXe { get; set; }
        public DateTime ThoiGianDonUocTinh { get; set; }
        public decimal GiaTienUocTinh { get; set; }
        public double LongitudeTaiXe { get; set; }
        public double LatitudeTaiXe { get; set; }
    }
}