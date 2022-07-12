
using Domain.Entities;
using Domain.Entities.OrderAggregate;

namespace Domain.Interfaces
{
    public interface IPaymentService
    {
        Task<CustomerBasket> CreateOrUpdatePaymentIntent(string basketId);
        Task<Order> UpdateOrderStatusPaymentSucceeded(string paymentIntentId);
        Task<Order> UpdateOrderStatusPaymentFailed(string paymentIntentId);
    }
}