

using System.Text;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers
{
    public class CachedAttribute : Attribute, IAsyncActionFilter
    {
        private readonly int _cachedResponseLifeSpanInSeconds;

        public CachedAttribute(int cachedResponseLifeSpanInSeconds)
        {
            _cachedResponseLifeSpanInSeconds = cachedResponseLifeSpanInSeconds;
        }

        
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var cacheService = context.HttpContext.RequestServices.GetRequiredService<IApiResponseCacheService>();

            // check if there is already a cached response with that database key
            var cacheKey = GenerateCacheKeyFromRequest(context.HttpContext.Request);
            var cachedResponse = await cacheService.GetCacheResponseAsync(cacheKey);

            // If thtere is already a cached response, send it back to he client
            if(!string.IsNullOrEmpty(cachedResponse))
            {
                // Create a content response which contains the cached response from memory
                var contentResponse = new ContentResult
                {
                    Content = cachedResponse,
                    ContentType = "application/json",
                    StatusCode = 200
                };

                context.Result = contentResponse;

                return;
            }

            // have the request procced to the controller if there isn't a cached response
            var executedContext = await next();

            // Cache successful responses
            if(executedContext.Result is OkObjectResult okObjectResult )
            {
                await cacheService.CacheResponseAsync(cacheKey, okObjectResult.Value, TimeSpan.FromSeconds(_cachedResponseLifeSpanInSeconds));
            }

        }

        private string GenerateCacheKeyFromRequest(HttpRequest request)
        {
            var cacheKeyBuilder = new StringBuilder();
            cacheKeyBuilder.Append($"{request.Path}");

            /* append the keys and values in the query string in an ordered format to the cacheKey string */
            foreach (var (key, value) in request.Query.OrderBy(x => x.Key))
            {
                cacheKeyBuilder.Append($"|{key}-{value}");
            }

            return cacheKeyBuilder.ToString();
            
        }
    }
}