
using API.Errors;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Domain.Entities.OrderAggregate;
using Order = Domain.Entities.OrderAggregate.Order;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly IPaymentService _paymentService;
        private const string whSecret = "whsec_ccb57254de580f161f4232083cebc3b556a816b0809cf430c92665b4858ff153";

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [Authorize]
        [HttpPost("{basketId}")]

         public async Task<ActionResult<CustomerBasket>> CreateOrUpdatePaymentIntent(string basketId)
         {
            var basket = await _paymentService.CreateOrUpdatePaymentIntent(basketId);
            
            if(basket == null) return BadRequest(new ApiResponse(400, "Problem with your basket"));

            return basket;
         }

         [HttpPost("webhook")]
         public async Task<ActionResult> StripeWebhook()
         {
            /* Get the information that stripe is sending
                outside the body of this request */
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            
            var stripeEvent = EventUtility.ConstructEvent(json, 
                Request.Headers["Stripe-Signature"], whSecret);
            
            PaymentIntent intent;
            Order order;

            /* Update order status based on what is stored in the event stripe sends */
            switch (stripeEvent.Type)
            {
                case "payment_intent.succeeded":
                    intent = (PaymentIntent) stripeEvent.Data.Object;
                    order = await _paymentService.UpdateOrderStatusPaymentSucceeded(intent.Id);
                    break;
                case "payment_intent.payment_failed":
                    intent = (PaymentIntent) stripeEvent.Data.Object;
                    order = await _paymentService.UpdateOrderStatusPaymentFailed(intent.Id);
                    break;
            }

            // confirm with stripe that the event was received 
            return new EmptyResult();

         }
    
    }
}