using System.Collections;
using Domain.Entities;
using Domain.Interfaces;

namespace Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly StoreContext _context;
        private Hashtable _repositories;

        public UnitOfWork(StoreContext context)
        {
            _context = context;
        }

        // Save tracked changes to the database
        public async Task<int> Complete()
        {
            return await _context.SaveChangesAsync();
        }

        /*Used to dispose of the context after a unit of work transaction has been completed */
        public void Dispose()
        {
            _context.Dispose();
        }
        
        // Update the list of repositories managed by the Unit of Work
        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            // Check if there is already a hash table created for the repos
            if (_repositories == null) _repositories = new Hashtable();
              
            // Get the entity name of the repo for example: Basket for BasketRepository
            var entityType = typeof(TEntity).Name;

            // Check to see if the hastable already contains this type of repository, if not then add it to the collection.
            if (!_repositories.ContainsKey(entityType))
            {
                var repositoryType = typeof(GenericRepository<>);
                var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(TEntity)), _context);

                _repositories.Add(entityType, repositoryInstance);
            }

            // return the repository of the type specified (TEntity)
            return (IGenericRepository<TEntity>) _repositories[entityType];
        }
    }
}