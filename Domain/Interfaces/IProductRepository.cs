using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IProductRepository
    {
        Task<Product> GetProductByIdAsync(int id);

        Task<IReadOnlyList<Entities.Product>> GetProductsAsync();
    }
}