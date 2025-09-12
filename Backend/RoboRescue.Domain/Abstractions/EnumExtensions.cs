namespace RoboRescue.Domain.Abstractions;

public static class EnumExtensions
{
    public static string FullKey(this Enum item)
    {
        var t = item.GetType();
        var enumGroupName = t.Name;
        var enumName = Enum.GetName(t, item);
        return $"{enumGroupName}_{enumName}";
    }

    public static string ToName(this Enum item)
    {
        return Enum.GetName(item.GetType(), item) ?? "--UNKNOWN--";
    }
}