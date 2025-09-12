using System.ComponentModel;
using System.Linq.Expressions;
using System.Reflection;

namespace RoboRescue.Domain.Abstractions;

public sealed class ValidationException : Exception
{
    public Type? ObjectType { get; private set; }
    public string? PropertyName { get; private set; }
    public object? AttemptedValue { get; private set; }
    public Error ErrorType { get; set; }

    public ValidationException(string message, Type? objectType = null, string? propertyName = null,
        object? attemptedValue = null, Error error = Error.Unknown)
        : base(message)
    {
        ErrorType = error;
        ObjectType = objectType;
        PropertyName = propertyName;
        AttemptedValue = attemptedValue;
    }

    public static ValidationExceptionBuilder<T> For<T>(T obj)
    {
        return new ValidationExceptionBuilder<T>(obj);
    }

    public static ValidationExceptionBuilder<T> For<T>(T obj, Expression<Func<T, object?>> expression)
    {
        var n = new ValidationExceptionBuilder<T>(obj);
        n.Property(expression);
        return n;
    }
}

public sealed class ValidationExceptionBuilder<T>
{
    private readonly T _obj;
    private string _message = string.Empty;
    private object? _attemptedValue;
    private string? _propName;
    private PropertyInfo? _propertyInfo;
    public Error ErrorType { get; set; } = Error.Unknown;

    public ValidationExceptionBuilder(T obj)
    {
        _obj = obj;
    }

    public ValidationExceptionBuilder<T> Property(string p, object? val)
    {
        _propName = p;
        _attemptedValue = val;
        return this;
    }

    public ValidationExceptionBuilder<T> Property(Expression<Func<T, object?>> expression)
    {
        if (expression.Body is not MemberExpression memberExpression) return this;

        _propertyInfo = (PropertyInfo)memberExpression.Member;
        _attemptedValue = _propertyInfo.GetValue(_obj);

        var displayAttribute =
            (DisplayNameAttribute?)_propertyInfo.GetCustomAttributes(typeof(DisplayNameAttribute), true)
                .FirstOrDefault();

        var displayName = displayAttribute?.DisplayName ?? memberExpression.Member.Name;
        _propName = displayName;

        return this;
    }

    public ValidationException Message(Error error, string message)
    {
        ErrorType = error;
        _message = message;
        return this.Build();
    }

    public ValidationException Message(Error error)
    {
        ErrorType = error;
        _message = error.ToName();
        return this.Build();
    }

    private ValidationException Build()
    {
        return new ValidationException(
            message: _message,
            objectType: _obj?.GetType(),
            propertyName: _propName,
            attemptedValue: _attemptedValue,
            error: ErrorType
        );
    }
}