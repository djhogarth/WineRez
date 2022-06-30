
using Domain.Entities.OrderAggregate;

namespace Domain.Interfaces
{
    public interface IOrderService
    {
        Task<Order> CreatedOrderAsync(string buyerEmail, int deliveryMethod, string basketId, Address shippingAddress);
        Task<IReadOnlyList<Order>> GetOrderForUsersAsync(string buyerEmail);
        Task<Order> GetOrderByIdAsync(int id, string buyerEmail);
        Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync();
    }
}