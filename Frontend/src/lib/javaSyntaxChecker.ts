export interface SyntaxError {
  line: number;
  column: number;
  message: string;
  explanation: string;
}

export interface SyntaxValidationResult {
  isValid: boolean;
  errors: SyntaxError[];
}

class JavaSyntaxChecker {
  validateSyntax(code: string): SyntaxValidationResult {
    const errors: SyntaxError[] = [];
    const lines = code.split("\n");
    // Heuristic: last closing brace usually marks end of the final type declaration
    const lastClosingBraceIndex = code.lastIndexOf("}");
    const lastClosingBraceLine =
      lastClosingBraceIndex >= 0
        ? code.substring(0, lastClosingBraceIndex).split("\n").length
        : -1;

    // Remove comments for high-level checks to avoid false positives/negatives
    const codeWithoutComments = code
      // Remove block comments
      .replace(/\/\*[\s\S]*?\*\//g, "")
      // Remove line comments
      .replace(/(^|\s)\/\/.*$/gm, "");

    // Check if code is empty
    if (!code || code.trim().length === 0) {
      errors.push({
        line: 1,
        column: 1,
        message: "Empty code",
        explanation: "Please enter some Java code to compile.",
      });
      return { isValid: false, errors };
    }

    // High-level structure checks using regex on comment-stripped code
    const hasClass = /\bclass\s+\w+/.test(codeWithoutComments);
    const hasInterface = /\binterface\s+\w+/.test(codeWithoutComments);
    if (!hasClass && !hasInterface) {
      errors.push({
        line: 1,
        column: 1,
        message: "Missing class or interface declaration",
        explanation:
          "Java code must contain at least one class or interface declaration.",
      });
    }

    // Main method requirement (avoid false positives for helper classes and Runnable examples)
    if (hasClass && !hasInterface) {
      const classDecls = codeWithoutComments.match(/\bclass\s+\w+/g) || [];
      const hasRunnableImpl = /\bimplements\s+Runnable\b/.test(
        codeWithoutComments
      );
      const hasMainMethod =
        /public\s+static\s+void\s+main\s*\(\s*String\s*\[\]\s*\w*\s*\)/.test(
          codeWithoutComments
        ) ||
        /static\s+void\s+main\s*\(\s*String\s*\[\]\s*\w*\s*\)/.test(
          codeWithoutComments
        );

      // Only enforce main when there's a single simple class without Runnable implementation
      if (
        classDecls.length === 1 &&
        !/abstract\s+class/.test(codeWithoutComments) &&
        !hasRunnableImpl &&
        !hasMainMethod
      ) {
        // Only report missing main if there are no top-level statements later
        // We'll check after scanning lines
        errors.push({
          line: 1,
          column: 1,
          message: "Missing main method",
          explanation:
            "Java programs need a main method to run. Add 'public static void main(String[] args) { ... }'",
        });
      }
    }

    // Check for balanced braces
    const braceCount =
      (code.match(/{/g) || []).length - (code.match(/}/g) || []).length;
    if (braceCount !== 0) {
      errors.push({
        line: 1,
        column: 1,
        message: `Unbalanced braces (${Math.abs(braceCount)} ${
          braceCount > 0 ? "opening" : "closing"
        } brace${Math.abs(braceCount) > 1 ? "s" : ""} missing)`,
        explanation:
          "Check that all opening braces '{' have corresponding closing braces '}'.",
      });
    }

    // Check for balanced parentheses
    const parenCount =
      (code.match(/\(/g) || []).length - (code.match(/\)/g) || []).length;
    if (parenCount !== 0) {
      errors.push({
        line: 1,
        column: 1,
        message: `Unbalanced parentheses (${Math.abs(parenCount)} ${
          parenCount > 0 ? "opening" : "closing"
        } parenthesis${Math.abs(parenCount) > 1 ? "es" : ""} missing)`,
        explanation:
          "Check that all opening parentheses '(' have corresponding closing parentheses ')'.",
      });
    }

    // Check for balanced brackets
    const bracketCount =
      (code.match(/\[/g) || []).length - (code.match(/\]/g) || []).length;
    if (bracketCount !== 0) {
      errors.push({
        line: 1,
        column: 1,
        message: `Unbalanced brackets (${Math.abs(bracketCount)} ${
          bracketCount > 0 ? "opening" : "closing"
        } bracket${Math.abs(bracketCount) > 1 ? "s" : ""} missing)`,
        explanation:
          "Check that all opening brackets '[' have corresponding closing brackets ']'.",
      });
    }

    // Check each line for syntax errors
    let inMultiLineComment = false;
    let braceDepth = 0;
    let hasTopLevelStatements = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;
      const trimmedLine = line.trim();

      // Skip completely empty lines
      if (!trimmedLine) continue;

      // Handle multi-line comments
      if (trimmedLine.startsWith("/*")) {
        inMultiLineComment = true;
        continue;
      }

      if (trimmedLine.includes("*/")) {
        inMultiLineComment = false;
        continue;
      }

      if (inMultiLineComment) {
        continue;
      }

      // Skip single-line comments and comment continuation lines
      if (
        trimmedLine.startsWith("//") ||
        trimmedLine.startsWith("*") ||
        (trimmedLine.startsWith("*") && !trimmedLine.includes("*/")) ||
        trimmedLine.trim() === "*"
      ) {
        continue;
      }

      // Skip lines that are part of multi-line statements (end with + for concatenation)
      if (trimmedLine.endsWith("+")) continue;

      // Top-level statement detection
      if (
        braceDepth === 0 &&
        !/^(package|import)\b/.test(trimmedLine) &&
        !/^(@\w+)/.test(trimmedLine) &&
        !/^(public|private|protected)\s+(class|interface)\b/.test(
          trimmedLine
        ) &&
        !/^(class|interface)\b/.test(trimmedLine) &&
        (trimmedLine.endsWith(";") ||
          /^new\s+/.test(trimmedLine) ||
          /^\w+[\w<>\[\],\s]*\s+\w+\s*(=|;|\()/.test(trimmedLine))
      ) {
        const afterLastType =
          lastClosingBraceLine !== -1 && lineNumber > lastClosingBraceLine;
        hasTopLevelStatements = true;
        if (!afterLastType) {
          errors.push({
            line: lineNumber,
            column: 1,
            message: "Statement outside of any class or method",
            explanation:
              "Java does not allow top-level statements. Move this code inside a method such as 'public static void main(String[] args) { ... }'.",
          });
        }
      }

      // Check for incorrect String type (lowercase 'string' should be 'String')
      if (trimmedLine.includes("string ") && !trimmedLine.includes("String ")) {
        errors.push({
          line: lineNumber,
          column: line.indexOf("string"),
          message: "Incorrect String type",
          explanation:
            "Java uses 'String' (capital S), not 'string' (lowercase s).",
        });
      }

      // Check for missing semicolons in interface method declarations
      if (
        code.includes("interface") &&
        (trimmedLine.includes("void ") ||
          trimmedLine.includes("String ") ||
          trimmedLine.includes("int ") ||
          trimmedLine.includes("boolean ") ||
          trimmedLine.includes("double ") ||
          trimmedLine.includes("float ") ||
          trimmedLine.includes("char ") ||
          trimmedLine.includes("byte ") ||
          trimmedLine.includes("short ") ||
          trimmedLine.includes("long ")) &&
        trimmedLine.includes("(") &&
        trimmedLine.includes(")") &&
        !trimmedLine.endsWith(";") &&
        !trimmedLine.endsWith("{") &&
        !trimmedLine.includes("class ") &&
        !trimmedLine.includes("interface ")
      ) {
        errors.push({
          line: lineNumber,
          column: line.length,
          message: "Missing semicolon in interface method declaration",
          explanation:
            "Interface method declarations must end with a semicolon ';'.",
        });
      }

      // Check for missing semicolons in abstract method declarations
      if (
        code.includes("abstract class") &&
        trimmedLine.includes("abstract ") &&
        (trimmedLine.includes("void ") ||
          trimmedLine.includes("String ") ||
          trimmedLine.includes("int ") ||
          trimmedLine.includes("boolean ") ||
          trimmedLine.includes("double ") ||
          trimmedLine.includes("float ") ||
          trimmedLine.includes("char ") ||
          trimmedLine.includes("byte ") ||
          trimmedLine.includes("short ") ||
          trimmedLine.includes("long ")) &&
        trimmedLine.includes("(") &&
        trimmedLine.includes(")") &&
        !trimmedLine.endsWith(";") &&
        !trimmedLine.includes("class ") &&
        !trimmedLine.includes("interface ")
      ) {
        errors.push({
          line: lineNumber,
          column: line.length,
          message: "Missing semicolon in abstract method declaration",
          explanation:
            "Abstract method declarations must end with a semicolon ';'.",
        });
      }

      // Check for missing semicolons (existing logic for classes)
      if (
        trimmedLine &&
        !trimmedLine.startsWith("//") &&
        !trimmedLine.startsWith("*") &&
        !trimmedLine.endsWith("{") &&
        !trimmedLine.endsWith("}") &&
        !trimmedLine.endsWith(";") &&
        !trimmedLine.includes("class ") &&
        !trimmedLine.includes("interface ") &&
        !trimmedLine.includes("abstract ") &&
        !trimmedLine.includes("public ") &&
        !trimmedLine.includes("private ") &&
        !trimmedLine.includes("protected ") &&
        !trimmedLine.includes("static ") &&
        !trimmedLine.includes("import ") &&
        !trimmedLine.includes("package ") &&
        !trimmedLine.includes("if ") &&
        !trimmedLine.includes("else") &&
        !trimmedLine.includes("for ") &&
        !trimmedLine.includes("while ") &&
        !trimmedLine.includes("do ") &&
        !trimmedLine.includes("switch ") &&
        !trimmedLine.includes("try ") &&
        !trimmedLine.includes("catch ") &&
        !trimmedLine.includes("finally") &&
        !trimmedLine.includes("case ") &&
        !trimmedLine.includes("default:") &&
        !trimmedLine.includes("break") &&
        !trimmedLine.includes("continue") &&
        !trimmedLine.includes("return") &&
        !trimmedLine.includes("throw") &&
        !trimmedLine.includes("synchronized") &&
        !trimmedLine.includes("volatile") &&
        !trimmedLine.includes("transient") &&
        !trimmedLine.includes("native") &&
        !trimmedLine.includes("final") &&
        !trimmedLine.includes("enum ") &&
        !trimmedLine.includes("extends ") &&
        !trimmedLine.includes("implements ") &&
        !trimmedLine.includes("throws ") &&
        !trimmedLine.includes("@") &&
        trimmedLine.length > 0
      ) {
        // Check if it looks like a statement that should end with semicolon
        if (
          (trimmedLine.includes("System.out.print") &&
            !trimmedLine.endsWith(";")) ||
          (trimmedLine.includes("=") &&
            !trimmedLine.endsWith(";") &&
            !trimmedLine.endsWith("{")) ||
          (trimmedLine.includes("return") && !trimmedLine.endsWith(";")) ||
          (trimmedLine.match(/^\s*\w+\s+\w+/) &&
            !trimmedLine.endsWith(";") &&
            !trimmedLine.endsWith("{")) || // Variable declarations
          (trimmedLine.includes("++") && !trimmedLine.endsWith(";")) ||
          (trimmedLine.includes("--") && !trimmedLine.endsWith(";")) ||
          (trimmedLine.includes("(") &&
            trimmedLine.includes(")") &&
            !trimmedLine.includes("{") &&
            !trimmedLine.endsWith(";")) // Method calls
        ) {
          errors.push({
            line: lineNumber,
            column: line.length,
            message: "Missing semicolon",
            explanation:
              "This statement appears to be missing a semicolon ';' at the end.",
          });
        }
      }

      // Update brace depth after this line
      const opens = (line.match(/\{/g) || []).length;
      const closes = (line.match(/\}/g) || []).length;
      braceDepth += opens - closes;

      // Check for invalid println statements
      if (line.includes("System.out.println") && !line.includes("(")) {
        errors.push({
          line: lineNumber,
          column: line.indexOf("System.out.println"),
          message: "Invalid println statement",
          explanation:
            "System.out.println requires parentheses around the text to print.",
        });
      }

      // Check for incorrect main method signature
      if (
        line.includes("public static void main") &&
        !line.includes("String[] args")
      ) {
        errors.push({
          line: lineNumber,
          column: line.indexOf("public static void main"),
          message: "Incorrect main method signature",
          explanation:
            "The main method must have the parameter 'String[] args'.",
        });
      }

      // Check for missing opening brace after class declaration
      if (line.includes("public class") && !line.includes("{")) {
        errors.push({
          line: lineNumber,
          column: line.length,
          message: "Missing opening brace after class declaration",
          explanation:
            "Class declarations must be followed by an opening brace '{'.",
        });
      }

      // Check for missing opening brace after interface declaration
      if (line.includes("public interface") && !line.includes("{")) {
        errors.push({
          line: lineNumber,
          column: line.length,
          message: "Missing opening brace after interface declaration",
          explanation:
            "Interface declarations must be followed by an opening brace '{'.",
        });
      }

      // Check for missing opening brace after method declaration
      if (line.includes("public static void main") && !line.includes("{")) {
        errors.push({
          line: lineNumber,
          column: line.length,
          message: "Missing opening brace after method declaration",
          explanation:
            "Method declarations must be followed by an opening brace '{'.",
        });
      }

      // Check for common keyword misspellings
      // Ignore content inside string literals and use Unicode-aware tokenization
      const nonStringPortion = trimmedLine.replace(/"(?:[^"\\]|\\.)*"/g, "");
      const words = nonStringPortion.match(/[\p{L}_]+/gu) || [];
      const javaKeywords = new Set([
        "abstract",
        "assert",
        "boolean",
        "break",
        "byte",
        "case",
        "catch",
        "char",
        "class",
        "const",
        "continue",
        "default",
        "do",
        "double",
        "else",
        "enum",
        "extends",
        "final",
        "finally",
        "float",
        "for",
        "goto",
        "if",
        "implements",
        "import",
        "instanceof",
        "int",
        "interface",
        "long",
        "native",
        "new",
        "null",
        "package",
        "private",
        "protected",
        "public",
        "return",
        "short",
        "static",
        "strictfp",
        "super",
        "switch",
        "synchronized",
        "this",
        "throw",
        "throws",
        "transient",
        "try",
        "void",
        "volatile",
        "while",
        "true",
        "false",
      ]);
      words.forEach((word) => {
        const cleanWord = word.trim();
        if (cleanWord) {
          const misspellings: { [key: string]: string } = {
            clase: "class",
            publik: "public",
            statik: "static",
            voyd: "void",
            mian: "main",
            Sytem: "System",
            prntln: "println",
            prnt: "print",
            Strng: "String",
            strng: "String",
            nt: "int",
            dble: "double",
            flot: "float",
            bln: "boolean",
            chr: "char",
            byt: "byte",
            shrt: "short",
            lng: "long",
            retrn: "return",
            fnal: "final",
            abstrct: "abstract",
            nterface: "interface",
            extnds: "extends",
            mplments: "implements",
            thrws: "throws",
            ctch: "catch",
            fnally: "finally",
            thrw: "throw",
            nw: "new",
            nll: "null",
            tr: "true",
            flse: "false",
            f: "if",
            els: "else",
            whle: "while",
            fr: "for",
            swtch: "switch",
            cse: "case",
            defalt: "default",
            brk: "break",
            cntnue: "continue",
          };

          const lower = cleanWord.toLowerCase();
          // Skip very short tokens (1-2 letters) to avoid false positives like 'fr' in comments/names
          if (lower.length <= 2) {
            return;
          }
          // Skip actual Java keywords entirely
          if (javaKeywords.has(lower)) {
            return;
          }
          const suggestion = misspellings[lower];
          if (suggestion && suggestion.toLowerCase() !== lower) {
            errors.push({
              line: lineNumber,
              column: line.indexOf(word),
              message: `Possible misspelling: '${cleanWord}'`,
              explanation: `Did you mean '${suggestion}'? Check the spelling of Java keywords.`,
            });
          }
        }
      });
    }

    // If top-level statements were found, remove the generic missing-main error to avoid redundancy
    if (hasTopLevelStatements) {
      const idx = errors.findIndex((e) => e.message === "Missing main method");
      if (idx !== -1) errors.splice(idx, 1);
    }

    // Check for interface implementation in abstract classes
    if (code.includes("abstract class") && code.includes("implements")) {
      // Extract interface name from implements clause
      const implementsMatch = code.match(/implements\s+(\w+)/);
      if (implementsMatch) {
        const interfaceName = implementsMatch[1];

        // Check if the interface is defined in the code
        if (code.includes(`interface ${interfaceName}`)) {
          // Extract interface methods
          const interfaceStart = code.indexOf(`interface ${interfaceName}`);
          const interfaceEnd = code.indexOf("}", interfaceStart);
          const interfaceCode = code.substring(interfaceStart, interfaceEnd);

          // Extract method signatures from interface
          const interfaceMethods = this.extractMethodSignatures(interfaceCode);

          // Extract method signatures from abstract class
          const classStart = code.indexOf("abstract class");
          const classEnd = code.lastIndexOf("}");
          const classCode = code.substring(classStart, classEnd);
          const classMethods = this.extractMethodSignatures(classCode);
          const abstractMethods =
            this.extractAbstractMethodSignatures(classCode);

          // Check if all interface methods are implemented (either concrete or abstract)
          for (const interfaceMethod of interfaceMethods) {
            const isImplemented = classMethods.some((classMethod) =>
              this.methodsMatch(interfaceMethod, classMethod)
            );

            const isAbstractlyDeclared = abstractMethods.some(
              (abstractMethod) =>
                this.methodsMatch(interfaceMethod, abstractMethod)
            );

            if (!isImplemented && !isAbstractlyDeclared) {
              errors.push({
                line: 1,
                column: 1,
                message: `Missing implementation of interface method: ${interfaceMethod}`,
                explanation: `The abstract class must implement all methods from the ${interfaceName} interface. You can either provide a concrete implementation or declare the method as abstract.`,
              });
            }
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Helper method to extract method signatures
  private extractMethodSignatures(code: string): string[] {
    const methods: string[] = [];
    const lines = code.split("\n");

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Look for method declarations (void, String, int, etc.) including abstract methods
      if (
        (trimmedLine.includes("void ") ||
          trimmedLine.includes("String ") ||
          trimmedLine.includes("int ") ||
          trimmedLine.includes("boolean ") ||
          trimmedLine.includes("double ") ||
          trimmedLine.includes("float ") ||
          trimmedLine.includes("char ") ||
          trimmedLine.includes("byte ") ||
          trimmedLine.includes("short ") ||
          trimmedLine.includes("long ")) &&
        trimmedLine.includes("(") &&
        trimmedLine.includes(")") &&
        !trimmedLine.includes("class ") &&
        !trimmedLine.includes("interface ")
      ) {
        // Extract method signature
        const methodMatch = trimmedLine.match(/(\w+\s+\w+\s*\([^)]*\))/);
        if (methodMatch) {
          methods.push(methodMatch[1]);
        }
      }
    }

    return methods;
  }

  // Helper method to extract abstract method signatures
  private extractAbstractMethodSignatures(code: string): string[] {
    const methods: string[] = [];
    const lines = code.split("\n");

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Look for abstract method declarations
      if (
        trimmedLine.includes("abstract ") &&
        (trimmedLine.includes("void ") ||
          trimmedLine.includes("String ") ||
          trimmedLine.includes("int ") ||
          trimmedLine.includes("boolean ") ||
          trimmedLine.includes("double ") ||
          trimmedLine.includes("float ") ||
          trimmedLine.includes("char ") ||
          trimmedLine.includes("byte ") ||
          trimmedLine.includes("short ") ||
          trimmedLine.includes("long ")) &&
        trimmedLine.includes("(") &&
        trimmedLine.includes(")") &&
        !trimmedLine.includes("class ") &&
        !trimmedLine.includes("interface ")
      ) {
        // Extract method signature (remove "abstract" keyword)
        const methodMatch = trimmedLine.match(
          /abstract\s+(\w+\s+\w+\s*\([^)]*\))/
        );
        if (methodMatch) {
          methods.push(methodMatch[1]);
        }
      }
    }

    return methods;
  }

  // Helper method to check if two method signatures match (allowing for overloading)
  private methodsMatch(interfaceMethod: string, classMethod: string): boolean {
    // Extract method name and parameters
    const interfaceMatch = interfaceMethod.match(/(\w+)\s*\(([^)]*)\)/);
    const classMatch = classMethod.match(/(\w+)\s*\(([^)]*)\)/);

    if (!interfaceMatch || !classMatch) return false;

    const interfaceName = interfaceMatch[1];
    const className = classMatch[1];

    // Method names must match
    if (interfaceName !== className) return false;

    // For interface implementation, we need at least one method with matching parameters
    // But we also allow method overloading (same name, different parameters)
    return true; // Allow overloading - any method with the same name is acceptable
  }
}

// Create and export a singleton instance
export const javaSyntaxChecker = new JavaSyntaxChecker();
