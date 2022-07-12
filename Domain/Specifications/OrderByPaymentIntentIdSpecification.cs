
using Domain.Entities.OrderAggregate;

namespace Domain.Specifications
{
    public class OrderByPaymentIntentIdSpecification : BaseSpecifcation<Order>
    {
        public OrderByPaymentIntentIdSpecification(string paymentIntentId) 
        : base(o => o.PaymentIntentId == paymentIntentId)
        {
        }
    }
}