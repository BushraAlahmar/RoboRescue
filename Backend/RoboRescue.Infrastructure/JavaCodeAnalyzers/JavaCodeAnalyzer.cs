using System.Text.RegularExpressions;
using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.JavaCodeAnalyzer;
using RoboRescue.Domain.CodeAnalyzers;

namespace RoboRescue.Infrastructure.JavaCodeAnalyzers;

public class JavaCodeAnalyzer : IJavaCodeAnalyzer
{
    // Regex patterns stored as constants for maintainability
    private const string ClassPattern = @"\bclass\s+(\w+)";
    private const string InterfacePattern = @"\binterface\s+(\w+)";
    private const string InheritancePattern = @"\bextends\s+\w+";
    private const string InterfaceImplementationPattern = @"\bimplements\s+\w+";

    private const string MemberDeclarationPattern =
        @"\b(public|private|protected|static|final)\s+[\w<>[\]]+\s+\w+\s*[;=]";

    private const string PrivateMemberPattern = @"\bprivate\s+[\w<>[\]]+\s+\w+\s*[;=]";
    private const string ProtectedMemberPattern = @"\bprotected\s+[\w<>[\]]+\s+\w+\s*[;=]";
    private const string AbstractClassPattern = @"\babstract\s+class\b";
    private const string AbstractMethodPattern = @"\babstract\s+[\w<>[\]]+\s+\w+\s*\([^)]*\)\s*;";

    private const string MethodPattern =
        @"(?:public|private|protected)?\s*(?:static\s+)?(?:final\s+)?[\w<>[\]]+\s+(\w+)\s*\(([^)]*)\)";

    private const string ConstructorPattern = @"\b(public|private|protected)?\s*{0}\s*\(([^)]*)\)";
    private const string StaticMemberPattern = @"\bstatic\s+[\w<>[\]]+\s+\w+\s*[;=]";
    private const string FinalMemberPattern = @"\bfinal\s+[\w<>[\]]+\s+\w+\s*[;=]";
    private const string GenericPattern = @"<\s*\w+\s*>";
    private const string OverrideAnnotation = @"@Override";

    public AnalyzerProperties AnalyzeJavaCode(string code)
    {
        var result = new AnalyzerProperties();

        // Remove comments (single-line // and multiline /* */)
        string cleanCode = RemoveComments(code);

        // Basic structure counts
        result.ClassCount = Regex.Matches(cleanCode, ClassPattern).Count;
        result.InterfaceCount = Regex.Matches(cleanCode, InterfacePattern).Count;

        // Inheritance and implementation
        result.HasInheritance = Regex.IsMatch(cleanCode, InheritancePattern);
        result.HasInterfaceImplementation = Regex.IsMatch(cleanCode, InterfaceImplementationPattern);

        // Encapsulation details
        result.HasEncapsulation = Regex.IsMatch(cleanCode, MemberDeclarationPattern);
        result.HasPrivateMembers = Regex.IsMatch(cleanCode, PrivateMemberPattern);
        result.HasProtectedMembers = Regex.IsMatch(cleanCode, ProtectedMemberPattern);

        // Abstraction
        result.HasAbstractClass = Regex.IsMatch(cleanCode, AbstractClassPattern);
        result.HasAbstractMethods = Regex.IsMatch(cleanCode, AbstractMethodPattern) ||
                                    result.InterfaceCount > 0;

        // Advanced analysis
        result.HasPolymorphism = Regex.IsMatch(cleanCode, OverrideAnnotation) ||
                                 result.HasMethodOverloading ||
                                 result.HasConstructorOverloading ||
                                 result.HasAbstractMethods ||
                                 result.HasInterfaceImplementation;

        result.HasComposition = DetectComposition(cleanCode);
        result.HasMethodOverloading = DetectMethodOverloading(cleanCode);
        result.HasConstructorOverloading = DetectConstructorOverloading(cleanCode);
        result.HasStaticMembers = Regex.IsMatch(cleanCode, StaticMemberPattern);
        result.HasFinalMembers = Regex.IsMatch(cleanCode, FinalMemberPattern);
        result.HasGenerics = Regex.IsMatch(cleanCode, GenericPattern);

        return result;
    }

    private static bool DetectComposition(string code)
    {
        var customTypes = new HashSet<string>();
        var primitiveTypes = new HashSet<string>
        {
            "int", "byte", "short", "long", "float",
            "double", "boolean", "char", "void", "String"
        };

        // Get all custom types defined in the code
        foreach (Match match in Regex.Matches(code, ClassPattern))
        {
            customTypes.Add(match.Groups[1].Value);
        }

        // Check for fields with custom types
        foreach (Match field in Regex.Matches(code, @"\b(?:public|private|protected)\s+([\w<>[\]]+)\s+\w+\s*[;=]"))
        {
            string typeName = Regex.Replace(field.Groups[1].Value, GenericPattern, "").Trim();
            if (customTypes.Contains(typeName) && !primitiveTypes.Contains(typeName))
            {
                return true;
            }
        }

        return false;
    }

    private static bool DetectMethodOverloading(string code)
    {
        var methodGroups = new Dictionary<string, List<string>>();

        foreach (Match method in Regex.Matches(code, MethodPattern))
        {
            string methodName = method.Groups[1].Value;
            string parameters = method.Groups[2].Value;

            if (!methodGroups.ContainsKey(methodName))
            {
                methodGroups[methodName] = new List<string>();
            }

            // Check if we already have a method with same name but different parameters
            foreach (var existingParams in methodGroups[methodName])
            {
                if (NormalizeParameters(existingParams) != NormalizeParameters(parameters))
                {
                    return true;
                }
            }

            methodGroups[methodName].Add(parameters);
        }

        return false;
    }

    private static string NormalizeParameters(string parameters)
    {
        // Remove whitespace and parameter names, keep only types
        return Regex.Replace(parameters, @"\s*\w+\s*(?:,|$)", "").Replace(" ", "");
    }

    private static bool DetectConstructorOverloading(string code)
    {
        var constructorCounts = new Dictionary<string, HashSet<string>>();

        // Regex to identify instances of 'new ClassName' to exclude them
        string newKeywordPattern = @"new\s+(\w+)\s*\(";

        foreach (Match classDef in Regex.Matches(code, ClassPattern))
        {
            string className = classDef.Groups[1].Value;
            string constructorPattern = string.Format(ConstructorPattern, className);

            // Store locations of all 'new ClassName' instances
            HashSet<int> newInstances = new HashSet<int>();
            foreach (Match newMatch in Regex.Matches(code, newKeywordPattern))
            {
                newInstances.Add(newMatch.Index);
            }

            foreach (Match constructor in Regex.Matches(code, constructorPattern))
            {
                // Get the starting index of the constructor
                int constructorIndex = constructor.Index;

                // Skip if this constructor is after a new keyword
                if (newInstances.Any(index => index > constructorIndex))
                {
                    continue;
                }

                string parameters = constructor.Groups[2].Value; // Assume parameters are captured in group 2
                if (!constructorCounts.ContainsKey(className))
                {
                    constructorCounts[className] = new HashSet<string>();
                }

                // Store parameter types as a unique identifier
                constructorCounts[className].Add(parameters);

                // Check for overloading
                if (constructorCounts[className].Count > 1)
                {
                    return true; // Overloading detected
                }
            }
        }

        return false; // No overloading detected
    }

    // Method to remove comments from Java code
    private string RemoveComments(string code)
    {
        // Remove multiline comments /* ... */
        string noMultilineComments = Regex.Replace(code, @"/\*.*?\*/", "", RegexOptions.Singleline);

        // Remove single line comments // ...
        string noComments = Regex.Replace(noMultilineComments, @"//.*", "");

        return noComments;
    }
}