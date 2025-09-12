namespace RoboRescue.Application.Abstractions.JavaCodeAnalyzer;

public interface IJavaCodeAnalyzer
{
    AnalyzerProperties AnalyzeJavaCode(string code);
}