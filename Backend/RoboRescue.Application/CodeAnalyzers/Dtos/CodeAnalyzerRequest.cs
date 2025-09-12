namespace RoboRescue.Application.CodeAnalyzers.Dtos;

public abstract class CodeAnalyzerRequest
{
    public int ClassCount { get; set; }
    public int InterfaceCount { get; set; }
    public bool HasInheritance { get; set; }
    public bool HasInterfaceImplementation { get; set; }
    public bool HasEncapsulation { get; set; }
    public bool HasPrivateMembers { get; set; }
    public bool HasProtectedMembers { get; set; }
    public bool HasAbstractClass { get; set; }
    public bool HasAbstractMethods { get; set; }
    public bool HasPolymorphism { get; set; }
    public bool HasComposition { get; set; }
    public bool HasMethodOverloading { get; set; }
    public bool HasConstructorOverloading { get; set; }
    public bool HasStaticMembers { get; set; }
    public bool HasFinalMembers { get; set; }
    public bool HasGenerics { get; set; }
}