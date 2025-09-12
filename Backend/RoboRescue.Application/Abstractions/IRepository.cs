using System.Linq.Expressions;
using Ardalis.Specification;
using RoboRescue.Domain.Abstractions;

namespace RoboRescue.Application.Abstractions;

public interface IRepository<T> : IReadRepositoryBase<T> where T : BaseEntity
{
    Task<bool> Add(T obj, CancellationToken cancellationToken);
    Task<bool> AddRange(List<T> obj, CancellationToken cancellationToken);
    bool Update(T obj);
    bool UpdateRange(ICollection<T> obj);
    bool Delete(T obj);
    bool DeleteRange(List<T> obj);

    Task<List<T>> GetSpecifiedList(Specification<T> specification, CancellationToken cancellationToken);

    Task<List<T>?> GetAllWithRelated(Specification<T> specification, CancellationToken cancellationToken,
        params Expression<Func<T, object>>[] expressionList);

    Task<T?> GetWithRelated(Specification<T> specification,
        CancellationToken cancellationToken,
        params Expression<Func<T, object>>[] includes);

    Task<PaginatedList<TProj>> GetSpecifiedPaginatedList<TProj>(PaginatedRequest<T, TProj> paginatedRequest,
        CancellationToken cancellationToken) where TProj : class;

    IQueryable<T> GetQuery();
}