using CarBookingServices.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CarBookingServices.Services.Authentication
{
    public class AuthenticationService : IAuthenticationService
    {
        public string GenerateToken(string soDienThoai)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("carbookingsecretkey@123"));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, soDienThoai),
            };

            var token = new JwtSecurityToken(
                issuer: "http://localhost:5000",
                audience: "http://localhost:28445",
                claims,
                expires: DateTime.UtcNow.AddMinutes(10),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
