using System.Linq.Expressions;
using Core.Interfaces;

namespace Core.Specifications;

public class BaseSpecification<T> : ISpecification<T>
{
    public Expression<Func<T, bool>> Criteria { get; }
    public List<Expression<Func<T, object>>>
        Includes
    { get; } = new List<Expression<Func<T, object>>>();

    public Expression<Func<T, object>> OrderBy { get; private set; }
    public Expression<Func<T, object>> OrderByDescending { get; private set; }

    public int Take { get; private set; }
    public int Skip { get; private set; }
    public bool IsPageingEnabled { get; private set; }

    public BaseSpecification() { }
    public BaseSpecification(Expression<Func<T, bool>> criteria)
    {
        Criteria = criteria;
    }

    protected void AddInclude(
        Expression<Func<T, object>> expression)
    {
        Includes.Add(expression);
    }

    protected void AddOrderBy(
        Expression<Func<T, object>> expression)
    {
        OrderBy = expression;
    }

    protected void AddOrderByDesceding(
        Expression<Func<T, object>> expression)
    {
        OrderByDescending = expression;
    }

    protected void ApplyPaging(int skip, int take)
    {
        Skip = skip;
        Take = take;
        IsPageingEnabled = true;
    }
}
