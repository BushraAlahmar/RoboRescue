namespace RoboRescue.Domain.Abstractions;

public abstract class BaseEntity
{
    private readonly List<IDomainEvent> _domainEvents = [];

    protected BaseEntity(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; init; }
    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? UpdatedAt { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }

    public void RefreshLastUpdatedAt()
    {
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void SoftDelete()
    {
        DeletedAt = DateTimeOffset.UtcNow;
    }


    public IReadOnlyList<IDomainEvent> GetDomainEvents()
    {
        return _domainEvents.ToList();
    }

    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }

    protected void RaiseDomainEvent(IDomainEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }
}