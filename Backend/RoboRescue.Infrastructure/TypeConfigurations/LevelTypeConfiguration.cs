using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RoboRescue.Domain.Levels;

namespace RoboRescue.Infrastructure.TypeConfigurations;

internal sealed class LevelTypeConfiguration : IEntityTypeConfiguration<Level>
{
    public void Configure(EntityTypeBuilder<Level> builder)
    {
        // var abstraction = Section.Create("Abstraktion", 1,
        //     "In dieser Abteilung des Spiels lernt man, wie sich Abstraktion in der objektorientierten\nProgrammierung (OOP) praktisch anwenden lässt.\nZiel ist es, die gemeinsamen Eigenschaften verschiedener Robotertypen zu erkennen und zu\nstrukturieren, um Redundanz im Code zu vermeiden und Wartbarkeit zu erhöhen.");
        // builder.HasData(abstraction);  77306d9d-48f4-442c-80e2-182ed463146f
        // var level1Section1Analyzer = CodeAnalyzer.Create(
        //     classCount: 0,
        //     interfaceCount: 1,
        //     hasInheritance: false,
        //     hasEncapsulation: false,
        //     hasPolymorphism: true,
        //     hasGenerics: false,
        //     hasComposition: false,
        //     hasMethodOverloading: false,
        //     hasConstructorOverloading: false,
        //     hasStaticMembers: false,
        //     hasAbstractMethods: true,
        //     hasAbstractClass: false,
        //     hasFinalMembers: false,
        //     hasInterfaceImplementation: false,
        //     hasPrivateMembers: false,
        //     hasProtectedMembers: false
        // );  
        // builder.HasData(level1Section1Analyzer);  41db2e62-6483-40f0-a251-bf33c9bc673f
        // var level2Section1Analyzer = CodeAnalyzer.Create(
        //     classCount: 1,
        //     interfaceCount: 1,
        //     hasInheritance: false,
        //     hasEncapsulation: true,
        //     hasPolymorphism: true,
        //     hasGenerics: false,
        //     hasComposition: false,
        //     hasMethodOverloading: false,
        //     hasConstructorOverloading: false,
        //     hasStaticMembers: false,
        //     hasAbstractMethods: true,
        //     hasAbstractClass: true,
        //     hasFinalMembers: false,
        //     hasInterfaceImplementation: true,
        //     hasPrivateMembers: false,
        //     hasProtectedMembers: true
        // );
        // builder.HasData(level2Section1Analyzer);  47e48cc0-e562-46da-b9b0-c2074f1bb1c8
        // var level3Section1Analyzer = CodeAnalyzer.Create(
        //     classCount: 1,
        //     interfaceCount: 1,
        //     hasInheritance: true,
        //     hasEncapsulation: true,
        //     hasPolymorphism: true,
        //     hasGenerics: true,
        //     hasComposition: false,
        //     hasMethodOverloading: false,
        //     hasConstructorOverloading: false,
        //     hasStaticMembers: false,
        //     hasAbstractMethods: true,
        //     hasAbstractClass: false,
        //     hasFinalMembers: false,
        //     hasInterfaceImplementation: false,
        //     hasPrivateMembers: true,
        //     hasProtectedMembers: false
        // );
        // builder.HasData(level3Section1Analyzer);  d6b7be36-ba48-40ae-ba1f-14009ba32e1b
        // var level4Section1Analyzer = CodeAnalyzer.Create(
        //     classCount: 4,
        //     interfaceCount: 1,
        //     hasInheritance: true,
        //     hasEncapsulation: false,
        //     hasPolymorphism: true,
        //     hasGenerics: false,
        //     hasComposition: false,
        //     hasMethodOverloading: false,
        //     hasConstructorOverloading: false,
        //     hasStaticMembers: false,
        //     hasAbstractMethods: true,
        //     hasAbstractClass: true,
        //     hasFinalMembers: false,
        //     hasInterfaceImplementation: false,
        //     hasPrivateMembers: false,
        //     hasProtectedMembers: false
        // );
        // builder.HasData(level4Section1Analyzer);  4e7f39f8-e67d-4bf0-b163-6768641696c1
        // var level1Section1 = Level.Create("Roboter-Interface erstellen", 1, abstraction.Id, level1Section1Analyzer.Id,
        //     "Die Konstruktionsabteilung kann keine einheitlichen Schnittstellen für verschiedene\nRobotertypen definieren. Jeder Robotertyp wird völlig unabhängig entwickelt, was zu\nRedundanz und Inkonsistenzen führt.",
        //     "Erstellen Sie ein Interface Roboter , das die gemeinsamen Methoden (Starten, Stoppen,\nBewegen, getStatus, getEnergieLevel) aller Robotertypen definiert.",
        //     "true", null);
        // builder.HasData(level1Section1);
        // var level2Section1 = Level.Create("Abstrakte Roboterbasis-Klasse ", 2, abstraction.Id,
        //     level2Section1Analyzer.Id,
        //     "Die Roboter-Implementierungen enthalten viel redundanten Code für grundlegende\nFunktionen. Dies führt zu Wartungsproblemen und Inkonsistenzen.",
        //     "Erstellen Sie eine abstrakte Basisklasse AbstractRoboter , die die gemeinsame\nFunktionalität implementiert.",
        //     "true", level1Section1.Id);
        // builder.HasData(level2Section1);
        // var level3Section1 = Level.Create("Generischer Roboter-Container", 3, abstraction.Id,
        //     level3Section1Analyzer.Id,
        //     "Die Konstruktionsabteilung hat Schwierigkeiten, verschiedene Robotertypen effizient zu\nverwalten. Für jeden Robotertyp gibt es separate Verwaltungsklassen, was zu\nRedundanz und Komplexität führt.",
        //     "Erstellen Sie eine generische Container-Klasse RoboterContainer<T extends Roboter> ,\ndie Roboter beliebigen Typs verwalten kann.",
        //     "true", level1Section1.Id);
        // builder.HasData(level3Section1);
        // var level4Section1 = Level.Create(" Roboter-Diagnosesystem mit Abstraktion", 4, abstraction.Id,
        //     level4Section1Analyzer.Id,
        //     "Die Konstruktionsabteilung braucht ein standardisiertes Diagnosesystem, um verschiedene\nRobotertypen auf Zustand, Energielevel und Funktionsfähigkeit zu überprüfen.\nBisher gibt es manuelle Routinen für jeden Robotertyp, was zu Redundanz und unflexibler\nWartung führt.",
        //     "Erstelle eine abstrakte Klasse DiagnoseTool, die mit allen Robotertypen über das RoboterInterface kompatibel ist und die Methode diagnostiziere(Roboter r) deklariert.",
        //     "true", level1Section1.Id);
        // builder.HasData(level4Section1);
        // var inheritance = Section.Create("Vererbung", 2,
        //     "In dieser Abteilung lernst du, wie Vererbung in der objektorientierten Programmierung (OOP)\npraktisch eingesetzt wird. Das Ziel ist, durch geschickte Klassenhierarchien Code-Redundanzen\nzu vermeiden und die Wartbarkeit zu verbessern, indem gemeinsame Eigenschaften und\nFunktionen optimal genutzt werden.");
        // builder.HasData(inheritance);
    }
}