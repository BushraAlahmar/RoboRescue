using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.Levels;

namespace RoboRescue.Domain.CodeAnalyzers;

public class CodeAnalyzer : BaseEntity
{
    private CodeAnalyzer(Guid id, int classCount, int interfaceCount, bool hasInheritance,
        bool hasInterfaceImplementation,
        bool hasEncapsulation,
        bool hasPrivateMembers, bool hasProtectedMembers, bool hasAbstractClass,
        bool hasPolymorphism, bool hasFinalMembers, bool hasGenerics, bool hasComposition,
        bool hasMethodOverloading, bool hasConstructorOverloading, bool hasStaticMembers,
        bool hasAbstractMethods) : base(id)
    {
        ClassCount = classCount;
        InterfaceCount = interfaceCount;
        HasInheritance = hasInheritance;
        HasInterfaceImplementation = hasInterfaceImplementation;
        HasEncapsulation = hasEncapsulation;
        HasPrivateMembers = hasPrivateMembers;
        HasProtectedMembers = hasProtectedMembers;
        HasAbstractClass = hasAbstractClass;
        HasPolymorphism = hasPolymorphism;
        HasGenerics = hasGenerics;
        HasComposition = hasComposition;
        HasMethodOverloading = hasMethodOverloading;
        HasConstructorOverloading = hasConstructorOverloading;
        HasStaticMembers = hasStaticMembers;
        HasAbstractMethods = hasAbstractMethods;
        HasFinalMembers = hasFinalMembers;
        Levels = new List<Level>();
    }

    public int ClassCount { get; private set; }
    public int InterfaceCount { get; private set; }

    public bool HasInheritance { get; private set; }
    public bool HasInterfaceImplementation { get; private set; }
    public bool HasEncapsulation { get; private set; }
    public bool HasPrivateMembers { get; private set; }
    public bool HasProtectedMembers { get; private set; }
    public bool HasAbstractClass { get; private set; }
    public bool HasAbstractMethods { get; private set; }
    public bool HasPolymorphism { get; private set; }
    public bool HasComposition { get; private set; }
    public bool HasMethodOverloading { get; private set; }
    public bool HasConstructorOverloading { get; private set; }
    public bool HasStaticMembers { get; private set; }
    public bool HasFinalMembers { get; private set; }
    public bool HasGenerics { get; private set; }
    public ICollection<Level> Levels { get; private set; }


    public static CodeAnalyzer Create(int classCount, int interfaceCount, bool hasInheritance,
        bool hasInterfaceImplementation,
        bool hasEncapsulation,
        bool hasPrivateMembers, bool hasProtectedMembers, bool hasAbstractClass,
        bool hasPolymorphism, bool hasFinalMembers, bool hasGenerics, bool hasComposition,
        bool hasMethodOverloading, bool hasConstructorOverloading, bool hasStaticMembers,
        bool hasAbstractMethods)
    {
        return new CodeAnalyzer(Guid.NewGuid(), classCount, interfaceCount, hasInheritance, hasInterfaceImplementation, hasEncapsulation, hasPrivateMembers, hasProtectedMembers, hasAbstractClass, hasPolymorphism,
            hasFinalMembers, hasGenerics, hasComposition, hasMethodOverloading, hasConstructorOverloading,
            hasStaticMembers, hasAbstractMethods);
    }

    public void Update(int classCount, int interfaceCount, bool hasInheritance,
        bool hasInterfaceImplementation,
        bool hasEncapsulation,
        bool hasPrivateMembers, bool hasProtectedMembers, bool hasAbstractClass,
        bool hasPolymorphism, bool hasFinalMembers, bool hasGenerics, bool hasComposition,
        bool hasMethodOverloading, bool hasConstructorOverloading, bool hasStaticMembers,
        bool hasAbstractMethods)
    {
        ClassCount = classCount;
        InterfaceCount = interfaceCount;
        HasInheritance = hasInheritance;
        HasInterfaceImplementation = hasInterfaceImplementation;
        HasEncapsulation = hasEncapsulation;
        HasPrivateMembers = hasPrivateMembers;
        HasProtectedMembers = hasProtectedMembers;
        HasAbstractClass = hasAbstractClass;
        HasPolymorphism = hasPolymorphism;
        HasGenerics = hasGenerics;
        HasComposition = hasComposition;
        HasMethodOverloading = hasMethodOverloading;
        HasConstructorOverloading = hasConstructorOverloading;
        HasStaticMembers = hasStaticMembers;
        HasAbstractMethods = hasAbstractMethods;
        HasFinalMembers = hasFinalMembers;
    }
}