
using Domain.Entities;
using Domain.Entities.OrderAggregate;
using Domain.Interfaces;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IGenericRepository<Order> _orderRepository;
        private readonly IGenericRepository<DeliveryMethod> _deliveryMethodRepository;
        private readonly IGenericRepository<Product> _productRepository;
        private readonly IBasketRepository _basketRepository;

        public OrderService(IGenericRepository<Order> orderRepository, 
            IGenericRepository<DeliveryMethod> deliveryMethodRepository, 
            IGenericRepository<Product> productRepository,
            IBasketRepository basketRepository)
        {
            _orderRepository = orderRepository;
            _deliveryMethodRepository = deliveryMethodRepository;
            _productRepository = productRepository;
            _basketRepository = basketRepository;
        }

        public async Task<Order> CreatedOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress)
        {
            // get basket from repository
            var basket = await _basketRepository.GetCustomerBasketAsync(basketId);
            // get product items from the product repository
            var items = new List<OrderItem>();
            foreach(var item in basket.Items)
            {
                var productItem = await _productRepository.GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl);
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);
                items.Add(orderItem);
            }
            // get delivery method from the repository
            var deliveryMethod = await _deliveryMethodRepository.GetByIdAsync(deliveryMethodId);
            // calculate the subtotal
            var subtotal = items.Sum( item => item.Price * item.Quantity);
            // create the order
            var order = new Order(items, buyerEmail, shippingAddress, deliveryMethod, subtotal);
            // save the order to the database (skip for now)
            // return the order
            return order;
        }

        public Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            throw new NotImplementedException();
        }

        public Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
             throw new NotImplementedException();

        }

        public Task<IReadOnlyList<Order>> GetOrderForUsersAsync(string buyerEmail)
        {
            throw new NotImplementedException();
        }
    }
}