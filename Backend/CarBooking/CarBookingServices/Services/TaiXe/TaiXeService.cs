using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using CarBookingDomain.Context;
using CarBookingDomain.DTO.TaiXe;
using CarBookingServices.Interfaces;
using GeoCoordinatePortable;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace CarBookingServices.Services.TaiXe
{
    public class TaiXeService : ITaiXeService
    {
        private readonly CarBookingDbContext _dbContext;
        public static ConcurrentQueue<string> messageQueue = new ConcurrentQueue<string>();
        static AutoResetEvent messageEnqueuedEvent = new AutoResetEvent(false);

        public TaiXeService(CarBookingDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public bool LuuThongTinViTriTaiXe(ViTriTaiXeDTO viTriTaiXe)
        {
            string viTriTaiXeJson = JsonConvert.SerializeObject(viTriTaiXe);
            return ThemMessageVaoCuoiQueue(viTriTaiXeJson) != 0;
        }

        static int ThemMessageVaoCuoiQueue(string message)
        {
            if (messageQueue.Count == 20)
            {
                messageQueue.Clear();
            }
            messageQueue.Enqueue(message);
            messageEnqueuedEvent.Set(); // Signal that a message has been enqueued

            return messageQueue.Count;
        }

        public async Task<TaiXeDTO> TimTaiXePhuHopTrongMessageQueueAsync(double latitudeKhachHang,
            double longitudeKhachHang, double latitudeDiemDen,
            double longitudeDiemDen)
        {
            if (messageQueue.Count == 0)
            {
                return null;
            }

            string soDienThoaiTaiXeDuocChon = string.Empty;
            var locationKhachHang = new GeoCoordinate(latitudeKhachHang, longitudeKhachHang);
            var locationTaiXe = new GeoCoordinate();
            double khoangCachTaiXeGanNhat = 0.0;
            double latitudeTaiXeDuocChon = 0.0;
            double longitudeTaiXeDuocChon = 0.0;
            double khoangCachDenTaiXeHienTai;
            double tongChieuDaiQuangDuong = locationKhachHang.GetDistanceTo(new GeoCoordinate(latitudeDiemDen, longitudeKhachHang));
            JObject json;
            foreach (var message in messageQueue)
            {
                json = JObject.Parse(message);
                locationTaiXe.Latitude = (double)json["LatitudeTaiXe"];
                locationTaiXe.Longitude = (double)json["LongitudeTaiXe"];
                khoangCachDenTaiXeHienTai = locationKhachHang.GetDistanceTo(locationTaiXe);
                if (khoangCachTaiXeGanNhat == 0.0 || khoangCachDenTaiXeHienTai < khoangCachTaiXeGanNhat)
                {
                    khoangCachTaiXeGanNhat = khoangCachDenTaiXeHienTai;
                    longitudeTaiXeDuocChon = locationTaiXe.Longitude;
                    latitudeTaiXeDuocChon = locationTaiXe.Latitude;
                    soDienThoaiTaiXeDuocChon = (string)json["SoDienThoaiTaiXe"];
                }
            }

            var taiXe = await _dbContext.TaiXe
                .FirstOrDefaultAsync(tx => tx.SoDienThoai == soDienThoaiTaiXeDuocChon);

            if (taiXe == null)
            {
                return null;
            }

            var taiXeDto = new TaiXeDTO
            {
                SoDienThoai = taiXe.SoDienThoai,
                HoTen = taiXe.HoTen,
                BienSoXe = taiXe.BienSoXe,

                // Gia tien 20000 vnd 1 km, khoangCachTaiXeGanNhat tinh theo met
                GiaTienUocTinh = (decimal)(tongChieuDaiQuangDuong * 20),

                // tinh trung binh 1km se di mat 3 phut
                ThoiGianDonUocTinh = DateTime.Now.AddMinutes(khoangCachTaiXeGanNhat * 3),
                LongitudeTaiXe = longitudeTaiXeDuocChon,
                LatitudeTaiXe = latitudeTaiXeDuocChon
            };

            return taiXeDto;
        }

        public void XoaTaiXeKhoiMessageQueue(string soDienThoaiTaiXe)
        {
            JObject json;
            foreach (var message in messageQueue)
            {
                json = JObject.Parse(message);
                if ((string)json["SoDienThoaiTaiXe"] == soDienThoaiTaiXe)
                {
                    messageQueue.TryDequeue(out string deletedMessage);
                }
            }
        }
    }
}