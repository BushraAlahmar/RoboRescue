using RoboRescue.Domain.CodeAnalyzers;

namespace RoboRescue.Application.Abstractions.JavaCodeAnalyzer;

public class AnalyzerProperties
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

    public List<string> CheckCode(CodeAnalyzer codeAnalyzer, string lang)
    {
        var errors = new List<string>();
        if (codeAnalyzer.ClassCount > ClassCount)
        {
            errors.Add(lang.Trim().ToLower().Equals("de")
                ? "Die Anzahl der Klassen ist geringer als erwartet"
                : "Class count less than expected");
        }

        if (codeAnalyzer.HasInheritance && !HasInheritance)
        {
            errors.Add(lang.Trim().ToLower().Equals("de")
                ? "Ihr Code sollte Vererbung verwenden"
                : "Your code should have inheritance");
        }

        if (codeAnalyzer.InterfaceCount > InterfaceCount)
        {
            errors.Add(lang.Trim().ToLower().Equals("de")
                ? "Ihr Code sollte Schnittstellen enthalten"
                : "Your code should have interfaces");
        }

        if (codeAnalyzer.HasInterfaceImplementation && !HasInterfaceImplementation)
        {
            errors.Add(lang.Trim().ToLower().Equals("de")
                ? "Ihr Code sollte Schnittstellen implementieren"
                : "Your code should have interfaces implemented");
        }

        if (codeAnalyzer.HasEncapsulation && !HasEncapsulation)
        {
            errors.Add(lang.Trim().ToLower().Equals("de")
                ? "Ihr Code sollte Kapselung verwenden"
                : "Your code should have encapsulation");
        }

        if (codeAnalyzer.HasPolymorphism && !HasPolymorphism)
        {
            errors.Add(lang.Trim().ToLower().Equals("de")
                ? "Ihr Code sollte Polymorphismus enthalten"
                : "Your code should have polymorphism");
        }

        if (codeAnalyzer.HasAbstractClass && !HasAbstractClass)
        {
            errors.Add(lang.Trim().ToLower().Equals("de")
                ? "Ihr Code sollte abstrakte Klassen enthalten"
                : "Your code should have abstraction");
        }

        if (codeAnalyzer.HasGenerics && !HasGenerics)
        {
            errors.Add(lang.Trim().ToLower().Equals("de")
                ? "Ihr Code sollte Generics verwenden"
                : "Your code should have generics");
        }

        if (codeAnalyzer.HasPrivateMembers && !HasPrivateMembers)
        {
            errors.Add(lang.Trim().ToLower().Equals("de")
                ? "Ihr Code sollte private Member enthalten"
                : "Your code should have private-properties");
        }

        if (codeAnalyzer.HasProtectedMembers && !HasProtectedMembers)
        {
            errors.Add(lang.Trim().ToLower().Equals("de")
                ? "Ihr Code sollte geschützte Member enthalten"
                : "Your code should have protected-properties");
        }

        if (codeAnalyzer.HasComposition && !HasComposition)
        {
            errors.Add(lang.Trim().ToLower().Equals("de")
                ? "Ihr Code sollte Komposition verwenden"
                : "Your code should have composition");
        }

        if (codeAnalyzer.HasMethodOverloading && !HasMethodOverloading)
        {
            errors.Add(lang.Trim().ToLower().Equals("de")
                ? "Ihr Code sollte Methodenüberladung enthalten"
                : "Your code should have method overloading");
        }

        if (codeAnalyzer.HasConstructorOverloading && !HasConstructorOverloading)
        {
            errors.Add(lang.Trim().ToLower().Equals("de")
                ? "Ihr Code sollte Konstruktorüberladung enthalten"
                : "Your code should have constructor overloading");
        }

        if (codeAnalyzer.HasFinalMembers && !HasFinalMembers)
        {
            errors.Add(lang.Trim().ToLower().Equals("de")
                ? "Ihr Code sollte final-Klassen oder -Methoden enthalten"
                : "Your code should have final-classes-or-methods");
        }

        if (codeAnalyzer.HasStaticMembers && !HasStaticMembers)
        {
            errors.Add(lang.Trim().ToLower().Equals("de")
                ? "Ihr Code sollte statische Member enthalten"
                : "Your code should have static-members");
        }

        if (codeAnalyzer.HasAbstractMethods && !HasAbstractMethods)
        {
            errors.Add(lang.Trim().ToLower().Equals("de")
                ? "Ihr Code sollte abstrakte Methoden enthalten"
                : "Your code should have abstract-methods");
        }

        return errors;
    }
}