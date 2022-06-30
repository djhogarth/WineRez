using API.DTOs;

namespace API.Controllers
{
    public class OrderDTO
    {
        public string BasketId {get; set;}
        public int DeliveryMethodId { get; set; }
        public AddressDTO ShipToAddress { get; set; }
    }
}