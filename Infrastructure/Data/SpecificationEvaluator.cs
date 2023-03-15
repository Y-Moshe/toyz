using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
  public class SpecificationEvaluator<TEntity> where TEntity : BaseEntity
  {
    public static IQueryable<TEntity> GetQuery(IQueryable<TEntity> inputQuery, ISpecification<TEntity> spec)
    {
      var query = inputQuery;

      if (spec.Criteria != null)
      {
        query = query.Where(spec.Criteria); // p => p.ProductTypeId == id
      }

      query = spec.Includes.Aggregate(query, (curr, expression) => curr.Include(expression));
      return query;
    }
  }
}