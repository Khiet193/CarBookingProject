using CarBookingDomain.DTO.TaiXe;
using System.Threading.Tasks;

namespace CarBookingServices.Interfaces
{
    public interface ITaiXeService
    {
        bool LuuThongTinViTriTaiXe(ViTriTaiXeDTO viTriTaiXe);
        Task<TaiXeDTO> TimTaiXePhuHopTrongMessageQueueAsync(double latitudeKhachHang,
            double longitudeKhachHang, double latitudeDiemDen,
            double longitudeDiemDen);

        void XoaTaiXeKhoiMessageQueue(string soDienThoaiTaiXe);
    }
}
