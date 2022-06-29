
using Domain.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class DeliveryMethodConfiguration : IEntityTypeConfiguration<DeliveryMethod>
    {
        public void Configure(EntityTypeBuilder<DeliveryMethod> builder)
        {
            // Specifying the DeliveryMethod table's price column data type as decimal
            builder.Property(d => d.Price)
                .HasColumnType("decimal(18,2");
        }
        
    }
}