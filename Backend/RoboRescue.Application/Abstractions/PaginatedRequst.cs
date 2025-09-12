using System.Linq.Expressions;
using Ardalis.Specification;
using RoboRescue.Domain.Abstractions;

namespace RoboRescue.Application.Abstractions;

public abstract class PaginatedRequest
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; }
    public bool Asc { get; set; }
    public DateTimeOffset? StartDate { get; set; }
    public DateTimeOffset? EndDate { get; set; }

    public string? Keyword { get; set; }

    public void Validate()
    {
        if (PageNumber < 1)
            PageNumber = 1;

        if (PageSize <= 0)
            PageSize = 30;
    }
}

public abstract class PaginatedRequest<T> : PaginatedRequest where T : BaseEntity
{
    private Expression<Func<T, object>> OrderByExpression { get; set; } = p => p.CreatedAt;
    public Expression<Func<T, object>> OrderBy() => OrderByExpression;

    private ISpecification<T>? _specification;

    public PaginatedRequest<T> Spec(ISpecification<T> specification)
    {
        _specification = specification;
        return this;
    }

    public ISpecification<T>? Spec() => _specification;
}

public abstract class PaginatedRequest<T, TProj> : PaginatedRequest where T : BaseEntity where TProj : class
{
    private Expression<Func<T, object>> OrderByExpression { get; set; } = p => p.Id;
    public Expression<Func<T, object>> OrderBy() => OrderByExpression;

    public void OrderBy(Expression<Func<T, object>> selector) => OrderByExpression = selector;

    private ISpecification<T>? _specification;

    public PaginatedRequest<T, TProj> Spec(ISpecification<T> specification)
    {
        _specification = specification;
        return this;
    }

    public ISpecification<T>? Spec() => _specification;
}