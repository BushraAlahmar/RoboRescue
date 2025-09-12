namespace RoboRescue.Application.Abstractions;

public sealed class PaginatedList<T> where T : notnull
{
    public PaginatedList(List<T> data, int totalCount, int pageSize, int pageNumber)
    {
        Data = data;
        TotalCount = totalCount;
        PageSize = pageSize;
        PageNumber = pageNumber;
    }

    public List<T> Data { get; private init; }

    public int TotalCount { get; set; }
    public int PageSize { get; set; }
    public int PageNumber { get; set; }
    public int TotalPages => PageSize == 0 ? 0 : (int)Math.Ceiling((double)TotalCount / PageSize);

    public int? NextPage => PageNumber < TotalPages ? PageNumber + 1 : null;
    public int? PreviousPage => PageNumber <= 1 ? null : PageNumber - 1;
}