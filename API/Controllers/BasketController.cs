using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly IBasketRepository _basketRepo;
        private readonly IMapper _mapper;

        public BasketController(IBasketRepository basketRepo, IMapper mapper)
        {
            _basketRepo = basketRepo;
            _mapper = mapper;
        }

        [HttpGet]

        public async Task<ActionResult<CustomerBasket>> GetBasketById(string basketId)
        {
            var basket = await _basketRepo.GetCustomerBasketAsync(basketId);
            return Ok(basket ?? new CustomerBasket(basketId));
        }

        [HttpPost]
        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasketDTO basket)
        {
            var customerBasket = _mapper.Map<CustomerBasketDTO, CustomerBasket>(basket);
            var updatedBasket = await _basketRepo.UpdateCustomerBasketAsync(customerBasket);
            return Ok(updatedBasket);
        }

        [HttpDelete]
        
        public async Task DeleteBasketAsync(string basketId)
        {
            await _basketRepo.DeleteCustomerBasketAsync(basketId);
        }
    }
}