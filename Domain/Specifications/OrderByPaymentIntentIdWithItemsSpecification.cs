
using System.Linq.Expressions;
using Domain.Entities.OrderAggregate;

namespace Domain.Specifications
{
    public class OrderByPaymentIntentIdWithItemsSpecification : BaseSpecifcation<Order>
    {
        public OrderByPaymentIntentIdWithItemsSpecification(string paymentIntentId) 
        : base(o => o.PaymentIntentId == paymentIntentId)
        {
        }
    }
}