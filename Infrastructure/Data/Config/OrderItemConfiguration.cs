
using Domain.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            // Establish that the OrderItem (oi) class owns the ProductItemOrdered (pio) class
            builder.OwnsOne(oi => oi.ItemOrdered, pio => {pio.WithOwner();});

            // Specifying the OrderItem table's price column data type as decimal
            builder.Property(oi => oi.Price)
                .HasColumnType("decimal(18,2");
        }
    }
}