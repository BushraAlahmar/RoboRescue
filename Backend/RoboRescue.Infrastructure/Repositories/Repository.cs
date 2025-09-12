using System.Linq.Expressions;
using Ardalis.Specification;
using Ardalis.Specification.EntityFrameworkCore;
using Mapster;
using Microsoft.EntityFrameworkCore;
using RoboRescue.Application.Abstractions;
using RoboRescue.Domain.Abstractions;

namespace RoboRescue.Infrastructure.Repositories;

internal class Repository<T> : RepositoryBase<T>, IRepository<T> where T : BaseEntity
{
    private readonly ApplicationDbContext _ctx;

    public Repository(ApplicationDbContext ctx) : base(ctx)
    {
        _ctx = ctx;
    }

    public Repository(ApplicationDbContext ctx, ISpecificationEvaluator specificationEvaluator) : base(ctx,
        specificationEvaluator)
    {
        _ctx = ctx;
    }

    public async Task<bool> Add(T obj, CancellationToken cancellationToken = default)
    {
        try
        {
            await _ctx.Set<T>().AddAsync(obj, cancellationToken);
            return true;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task<bool> AddRange(List<T> obj, CancellationToken cancellationToken)
    {
        try
        {
            await _ctx.Set<T>().AddRangeAsync(obj, cancellationToken);
            return true;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public bool Update(T obj)
    {
        try
        {
            _ctx.Set<T>().Update(obj);
            return true;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public bool UpdateRange(ICollection<T> obj)
    {
        try
        {
            _ctx.Set<T>().UpdateRange(obj);
            return true;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public bool Delete(T obj)
    {
        try
        {
            _ctx.Set<T>().Remove(obj);
            return true;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public bool DeleteRange(List<T> obj)
    {
        try
        {
            _ctx.Set<T>().RemoveRange(obj);
            return true;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task<List<T>> GetSpecifiedList(Specification<T> specification, CancellationToken cancellationToken)
    {
        return await _ctx.Set<T>().WithSpecification(specification).ToListAsync(cancellationToken);
    }


    public async Task<List<T>?> GetAllWithRelated(Specification<T> specification,
        CancellationToken cancellationToken,
        params Expression<Func<T, object>>[] includes)
    {
        return await includes
            .Aggregate(_ctx.Set<T>()
                    .WithSpecification(specification)
                    .AsQueryable(),
                (entity, property) => entity
                    .Include(property))
            .ToListAsync(cancellationToken);
    }


    public async Task<T?> GetWithRelated(Specification<T> specification,
        CancellationToken cancellationToken,
        params Expression<Func<T, object>>[] includes)
    {
        return await includes
            .Aggregate(_ctx.Set<T>()
                    .WithSpecification(specification)
                    .AsQueryable(),
                (entity, property) => entity
                    .Include(property))
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<PaginatedList<TProj>> GetSpecifiedPaginatedList<TProj>(
        PaginatedRequest<T, TProj> paginatedRequest,
        CancellationToken cancellationToken) where TProj : class
    {
        paginatedRequest.Validate();

        int count;

        var specification = paginatedRequest.Spec();

        IQueryable<T> query = _ctx.Set<T>();

        if (specification is not null)
        {
            count = await CountAsync(specification, cancellationToken);
            query = query.WithSpecification(specification);
        }
        else
        {
            count = await CountAsync(cancellationToken);
        }

        var order = paginatedRequest.OrderBy();

        query = paginatedRequest.Asc ? query.OrderBy(order) : query.OrderByDescending(order);
        var projected = query.ProjectToType<TProj>();

        projected = projected
            .Skip(paginatedRequest.PageSize * (paginatedRequest.PageNumber - 1))
            .Take(paginatedRequest.PageSize);

        var list = await projected.ToListAsync(cancellationToken: cancellationToken);

        return new PaginatedList<TProj>(list, count, pageSize: paginatedRequest.PageSize,
            pageNumber: paginatedRequest.PageNumber);
    }

    public IQueryable<T> GetQuery()
    {
        return _ctx.Set<T>();
    }
}