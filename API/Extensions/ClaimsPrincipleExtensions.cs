
using System.Security.Claims;

namespace API.Extensions
{
    public static class ClaimsPrincipleExtensions
    {
        public static string RetreiveEmailFromPrincipal(this ClaimsPrincipal user)
        {
            return user?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
        }
    }
}