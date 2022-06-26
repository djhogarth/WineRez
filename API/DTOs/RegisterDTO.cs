using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDTO
    {
        [Required]
        public string DisplayName { get; set; }

        [Required]
        [EmailAddress]        
        public string Email { get; set; }

        [Required]

        /*  Password validator that expects at least 1 lowercase letter, 
            1 capital letter, 1 digit, 1 special character and have 
            between 6-10 characters.  */
        [RegularExpression("(?=^.{6,12}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\\s).*$",
            ErrorMessage = "Password must have at least 1 uppercase, 1 lowercase, 1 number, 1 special character and be 6 - 12 characters")]
        public string Password { get; set; }
    }
}