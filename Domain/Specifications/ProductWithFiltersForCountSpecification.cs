using Domain.Entities;

namespace Domain.Specifications
{
    public class ProductWithFiltersForCountSpecification: BaseSpecifcation<Product>
    {
        public ProductWithFiltersForCountSpecification( ProductSpecificationParameters productParams)
        : base(x =>
                (string.IsNullOrEmpty(productParams.Search) || x.Name.ToLower().Contains
                    (productParams.Search)) && 
                (!productParams.BrandId.HasValue || x.ProductBrandId == productParams.BrandId) && 
                (!productParams.TypeId.HasValue || x.ProductTypeId == productParams.TypeId)
            )
        {
        }
    }
}