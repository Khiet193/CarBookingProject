using CarBookingDomain.Entity;
using Microsoft.EntityFrameworkCore;

namespace CarBookingDomain.Context
{
    public class CarBookingDbContext : DbContext
    {
        public DbSet<TaiKhoan> TaiKhoan { get; set; }
        public DbSet<KhachHang> KhachHang { get; set; }
        public DbSet<TaiXe> TaiXe { get; set; }
        public DbSet<DonHang> DonHang { get; set; }

        public CarBookingDbContext(DbContextOptions<CarBookingDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<KhachHang>()
            .HasOne(kh => kh.TaiKhoan)
            .WithMany()
            .HasForeignKey(kh => kh.SoDienThoai);

            modelBuilder.Entity<TaiXe>()
            .HasOne(tx => tx.TaiKhoan)
            .WithMany()
            .HasForeignKey(tx => tx.SoDienThoai); ;

            modelBuilder.Entity<TaiKhoan>().HasKey(k => k.SoDienThoai);
            modelBuilder.Entity<DonHang>().HasKey(k => k.IdDonHang);
        }
    }
}
