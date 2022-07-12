
using API.DTOs;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Domain.Entities.OrderAggregate;
using Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class OrderController : BaseApiController
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;

        public OrderController(IOrderService orderService, IMapper mapper)
        {
            _orderService = orderService;
            _mapper = mapper;
        }
        
        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(OrderDTO orderDTO)
        {
            var email = HttpContext.User.RetreiveEmailFromPrincipal();

            var address = _mapper.Map<AddressDTO, Address>(orderDTO.ShipToAddress);

            var order = await _orderService.CreatedOrderAsync(email, orderDTO.DeliveryMethodId, 
                orderDTO.BasketId, address);
                
            if(order == null) return BadRequest(new ApiResponse(400, "Problem creating order"));

            return Ok(order);

        }

        // Order Get methods

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<OrderDTO>>> GetOrders()
        {
            var email = HttpContext.User.RetreiveEmailFromPrincipal();
            var orders = await _orderService.GetOrderForUsersAsync(email);

            return Ok(_mapper.Map<IReadOnlyList<Order>, IReadOnlyList<OrderToReturnDTO>>(orders));
        }
        
        [HttpGet("{id}")]
         public async Task<ActionResult<OrderToReturnDTO>> GetOrderById(int id)
         {
            var email = HttpContext.User.RetreiveEmailFromPrincipal();
            var order = await _orderService.GetOrderByIdAsync(id, email);

            // If the order was not found, maybe because they specified the wrong Order ID
            if(order == null) return NotFound(new ApiResponse(404));

            return _mapper.Map<Order, OrderToReturnDTO>(order);
         }

         [HttpGet("deliveryMethods")]
         public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDiliveryMethods()
         {
            return Ok(await _orderService.GetDeliveryMethodsAsync());
         }
    }
}