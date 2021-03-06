using System.Linq.Expressions;

namespace Domain.Specifications
{
    public class BaseSpecifcation<T> : ISpecification<T>
    {
        public BaseSpecifcation()
        {
        }

        public BaseSpecifcation(Expression<Func<T, bool>> criteria)
        {
            Criteria = criteria;
        }

        public Expression<Func<T, bool>> Criteria {get;}
        public List<Expression<Func<T, object>>> Includes {get;} = new List<Expression<Func<T, object>>>();

        public Expression<Func<T, object>> OrderByAscending {get; private set;}

        public Expression<Func<T, object>> OrderByDescending {get; private set;}

        public int Take {get; private set;}

        public int Skip {get; private set;}

        public bool IsPagingEnabled {get; private set;}

        protected void AddInclude(Expression<Func<T, object>> includeExpression)
        {
            Includes.Add(includeExpression);
        }

        protected void AddOrderByAscending(Expression<Func<T, object>> orderByExpression)
        {
            OrderByAscending = orderByExpression;
        }
        protected void AddOrderByDescending(Expression<Func<T, object>> orderByExpression)
        {
            OrderByDescending = orderByExpression;
        }

        protected void ApplyPaging(int skip, int take)
        {
            Skip = skip;
            Take = take;
            IsPagingEnabled = true;
        }

    }
}