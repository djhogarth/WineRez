using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class SpecificationEvaluator<T> where T : BaseEntity
    {
        public static IQueryable<T> GetQuery (IQueryable<T> inputQuery, ISpecification<T> specification)
        {
            var query = inputQuery;

            if(specification.Criteria != null) query= query.Where(specification.Criteria);

            if(specification.OrderByAscending != null)           
                query = query.OrderBy(specification.OrderByAscending);
            
            if(specification.OrderByDescending != null)
                query = query.OrderByDescending(specification.OrderByDescending);

            if(specification.IsPagingEnabled)
                query = query.Skip(specification.Skip).Take(specification.Take);
            
            query = specification.Includes.Aggregate(query, (current, include) => current.Include(include));

            return query;
        }

    }
}