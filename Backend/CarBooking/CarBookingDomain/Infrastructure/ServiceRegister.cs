using AutoMapper;

namespace CarBookingDomain.Infrastructure
{
    public class ServiceRegister
    {
        public IMapper Register()
        {
            // Register Auto Mapper
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MappingProfile>();
            });

            return config.CreateMapper();
        }
    }
}