using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class BasketItemDTO
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string ProductName { get; set; }
        [Required]
        [Range(4.00, 65.00, ErrorMessage = "The price must be between 4 and 65 dollars"),]
        public decimal Price { get; set; }
        [Required]
        [Range(1, 50, ErrorMessage = "The quantity must be between 1 and 50 units")]
        public int Quantity { get; set; }
        [Required]
        public string PictureUrl { get; set; }
        [Required]
        public string Brand { get; set; }
        [Required]
        public string Type { get; set; }
    }
}