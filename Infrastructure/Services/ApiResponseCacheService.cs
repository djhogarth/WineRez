
using System.Text.Json;
using Domain.Interfaces;
using StackExchange.Redis;

namespace Infrastructure.Services
{
    public class ApiResponseCacheService : IApiResponseCacheService
    {
        private readonly IDatabase _database;       

        public ApiResponseCacheService(IConnectionMultiplexer redis)
        {
            _database = redis.GetDatabase();            
        }

        // insert response so it's cached into the Redis database
        public async Task CacheResponseAsync(string cacheKey, object response, TimeSpan timeToLive)
        {
            if(response == null)
            {
                return;
            }

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var serializedResponse = JsonSerializer.Serialize(response, options);
            if(_database.IsConnected(cacheKey))
            {
               await _database.StringSetAsync(cacheKey, serializedResponse, timeToLive);
               
            }
            
        }

        // get cached response
        public async Task<string> GetCachedResponseAsync(string cacheKey)
        {
            if(_database.IsConnected(cacheKey))
            {
                var cachedResponse = await _database.StringGetAsync(cacheKey);

                if(string.IsNullOrEmpty(cachedResponse))
                {
                    return null;
                } 
                
                return cachedResponse;
            }
            
            return null;
            
        }
    }
}