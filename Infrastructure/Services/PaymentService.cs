
using Domain.Entities;
using Domain.Entities.OrderAggregate;
using Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _config;

        public PaymentService( IBasketRepository basketRepository, 
            IUnitOfWork unitOfWork, 
            IConfiguration config)
        {
            _basketRepository = basketRepository;
            _unitOfWork = unitOfWork;
            _config = config;
        }

        /*  Create new payment intent if none exists or
            update the payment intent. The payment intent is 
            updated when the customer makes changes to their 
            basket items or order delivery method */
        public async Task<CustomerBasket> CreateOrUpdatePaymentIntent(string basketId)
        {
            StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];

            var basket = await _basketRepository.GetCustomerBasketAsync(basketId);

            // Check to see if there is a basket beofore creating payment intent
            if(basket == null) return null;
            
            var shippingPrice = basket.ShippingPrice;

            // Getting untampered with shipping price for the delivery method selected at checkout 
            if(basket.DeliveryMethodId.HasValue)
            {
                var deliveryMethod = await (_unitOfWork.Repository<DeliveryMethod>()
                    .GetByIdAsync((int) basket.DeliveryMethodId));
            }

            // Making sure that all cart items have prices that are accurate and not tampered with

            foreach(var shoppingCartitem in basket.Items)
            {
                var productItem = await _unitOfWork.Repository<Domain.Entities.Product>().GetByIdAsync(shoppingCartitem.Id);
                if(shoppingCartitem.Price != productItem.Price)
                {
                    shoppingCartitem.Price = productItem.Price;
                }
            }

            // Creating or updating the payment intent for the current order transaction 
            var service = new PaymentIntentService();
            PaymentIntent intent;
            
            if(string.IsNullOrEmpty(basket.PaymentIntentId))
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = (long) basket.Items.Sum(i => i.Quantity *(i.Price * 100)) + (long) shippingPrice * 100,
                    Currency = "cad",
                    PaymentMethodTypes = new List<string>{"card"}
                };

                intent = await service.CreateAsync(options);
                
                basket.PaymentIntentId = intent.Id;
                basket.ClientSecret = intent.ClientSecret;
            }
            else
            {
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = (long) basket.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long) shippingPrice * 100
                };

                await service.UpdateAsync(basket.PaymentIntentId, options);
            }

            await _basketRepository.UpdateCustomerBasketAsync(basket);

            // return basket with new or updated payment intent ID
            return basket;


        }
    }
}