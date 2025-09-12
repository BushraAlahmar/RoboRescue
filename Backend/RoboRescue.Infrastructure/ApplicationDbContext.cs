using System.Linq.Expressions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using RoboRescue.Application.Exceptions;
using RoboRescue.Domain.Abstractions;

namespace RoboRescue.Infrastructure
{
    public class ApplicationDbContext : DbContext, IUnitOfWork
    {
        private readonly IPublisher _publisher;

        // Correctly define the constructor
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IPublisher publisher)
            : base(options)
        {
            _publisher = publisher; // Store the publisher for later use
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseCollation("Latin1_General_100_CI_AS_KS_SC_UTF8");
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

            Expression<Func<BaseEntity, bool>> filterExpr = bm => !bm.DeletedAt.HasValue;
            foreach (var mutableEntityType in modelBuilder.Model.GetEntityTypes())
            {
                // check if current entity type is child of BaseModel
                if (mutableEntityType.ClrType.IsAssignableTo(typeof(BaseEntity)))
                {
                    // modify expression to handle correct child type
                    var parameter = Expression.Parameter(mutableEntityType.ClrType);
                    var body = ReplacingExpressionVisitor.Replace(filterExpr.Parameters.First(), parameter,
                        filterExpr.Body);
                    var lambdaExpression = Expression.Lambda(body, parameter);

                    // set filter
                    mutableEntityType.SetQueryFilter(lambdaExpression);
                }
            }

            foreach (var property in modelBuilder.Model.GetEntityTypes())
            {
                property.GetProperties().ToList().ForEach(e => e.SetIsUnicode(false));
            }

            base.OnModelCreating(modelBuilder);
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var result = await base.SaveChangesAsync(cancellationToken);
                await PublishingDomainEventAsync();
                return result;
            }
            catch (DbUpdateConcurrencyException e)
            {
                throw new ConcurrencyException("Concurrency exception occurred", e);
            }
        }

        private async Task PublishingDomainEventAsync()
        {
            var domainEvents = ChangeTracker
                .Entries<BaseEntity>()
                .Select(entry => entry.Entity)
                .SelectMany(entity =>
                {
                    var domainEvents = entity.GetDomainEvents();
                    entity.ClearDomainEvents();
                    return domainEvents;
                }).ToList();

            foreach (var domainEvent in domainEvents)
            {
                await _publisher.Publish(domainEvent);
            }
        }
    }
}