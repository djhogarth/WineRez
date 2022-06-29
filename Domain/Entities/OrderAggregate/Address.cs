
namespace Domain.Entities.OrderAggregate
{
    public class Address
    {
        public Address()
        {
        }

        public Address(string firstName, string lastName, string streetNumberAndName, string city, string stateOrProvince, string zipCode)
        {
            FirstName = firstName;
            LastName = lastName;
            StreetNumberAndName = streetNumberAndName;
            City = city;
            StateOrProvince = stateOrProvince;
            ZipCode = zipCode;
        }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string StreetNumberAndName { get; set; }
        public string City { get; set; }
        public string StateOrProvince { get; set; }
        public string ZipCode { get; set; }
    }
}