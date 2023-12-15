using System.Threading.Tasks;
using CarBookingDomain.ViewModels.DonHang;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace CarBookingServices.Services.SignalR
{
    public class SignalRService : Hub
    {
        public static string ChiTietKhachHangDonHang { get; set; }
        public static bool TaiXeChapNhan { get; set; } = false;
        public static bool DonHangThatBai { get; set; } = false;

        public static void GuiChiTietDonHangChoTaiXe(ChiTietDonHangVM chiTietDonHang)
        {
            ChiTietKhachHangDonHang = JsonConvert.SerializeObject(chiTietDonHang);
        }

        public async Task SendMessage(string message)
        {
            while (ChiTietKhachHangDonHang == null)
            {
                await Task.Delay(3000);
            }
            if (DonHangThatBai == false)
            {
                await Clients.All.SendAsync("ReceiveMessage", ChiTietKhachHangDonHang);
            }
        }

        public static async Task<bool> ChoTaiXeChapNhan()
        {
            var count = 0;
            while (TaiXeChapNhan == false)
            {
                await Task.Delay(5000);
                count++;
                if (count == 20)
                {
                    break;
                }
            }
            return TaiXeChapNhan;
        }
    }
}