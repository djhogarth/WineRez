
using Domain.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            // Establish that the Order aggregate class owns the Address class
            builder.OwnsOne(order => order.ShipToAddress, address =>
            {
                address.WithOwner();
            });
            /* Convert the default integer value of the enum to a string */
            builder.Property(order => order.Status)
                .HasConversion(
                    status => status.ToString(),
                    status => (OrderStatus) Enum.Parse(typeof(OrderStatus), status)
                );

            /*  An order is deleted then also delete any order items related to 
                that order. The order is to have a one-many relationship with the order items. */
            builder.HasMany(order => order.OrderItems).WithOne().OnDelete(DeleteBehavior.Cascade);
        }
    }
}