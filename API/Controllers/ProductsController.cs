using Infrastructure.Data;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Domain.Interfaces;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController: ControllerBase
    {
        private readonly IProductRepository _productRepository;
        
        public ProductsController(IProductRepository productRepository)
        {
            _productRepository = productRepository;
            
        }

        [HttpGet]

        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            var products = await _productRepository.GetProductsAsync();
            return Ok(products);
        }
        
        [HttpGet("brands")]

        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
        {
            var brands = await _productRepository.GetProductBrandsAsync();
            return Ok(brands);
        }

         [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes()
        {
            var types = await _productRepository.GetProductTypesAsync();
            return Ok(types);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            return await _productRepository.GetProductByIdAsync(id);
        }
    }
}