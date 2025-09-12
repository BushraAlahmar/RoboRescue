using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using RoboRescue.Domain.Abstractions;

namespace RoboRescue.Infrastructure;

public class UpdatedAtSetter : SaveChangesInterceptor
{
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = new())
    {
        if (eventData.Context is null)
        {
            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }

        foreach (var entityEntry in eventData.Context.ChangeTracker.Entries()
                     .Where(p => p.State == EntityState.Modified))
        {
            if (entityEntry.Entity is BaseEntity entity)
            {
                entity.RefreshLastUpdatedAt();
            }
        }

        foreach (var entityEntry in eventData.Context.ChangeTracker.Entries()
                     .Where(p => p.State == EntityState.Deleted))
        {
            if (entityEntry.Entity is BaseEntity entity)
            {
                entity.SoftDelete();
                entityEntry.State = EntityState.Modified;
            }
        }

        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }
}