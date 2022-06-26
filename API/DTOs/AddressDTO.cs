using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class AddressDTO
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string StreetNumberAndName { get; set; }
        [Required]
        public string City { get; set; }    
        [Required]
        public string StateOrProvince { get; set; }
        [Required]
        public string ZipCode { get; set; }
    }
}