namespace CarBookingServices.Interfaces
{
    public interface IAuthenticationService
    {
        string GenerateToken(string soDienThoai);
    }
}
