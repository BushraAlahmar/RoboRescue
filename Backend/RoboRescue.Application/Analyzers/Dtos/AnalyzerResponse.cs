namespace RoboRescue.Application.Analyzers.Dtos;

public class AnalyzerResponse
{
    public int ClassCount { get; set; }
    public bool HasInheritance { get; set; }
    public bool HasInterfaces { get; set; }
    public bool HasEncapsulation { get; set; }
    public bool HasPolymorphism { get; set; }
    public bool HasAbstraction { get; set; }
    public bool HasGenerics { get; set; }
    public bool HasPrivateProperties { get; set; }
    public bool HasComposition { get; set; }
    public bool HasMethodOverloading { get; set; }
    public bool HasConstructorOverloading { get; set; }
    public bool HasFinalClassesOrMethods { get; set; }
    public bool HasStaticMembers { get; set; }
    public bool HasAbstractMethods { get; set; }
}