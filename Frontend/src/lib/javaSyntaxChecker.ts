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

    // Main method requirement (only check if there are top-level statements)
    // We'll check for main method requirement after scanning all lines

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

    // Variable tracking for duplicate detection
    const variableScopes: { [depth: number]: Set<string> } = {};
    const variableDeclarations: { [depth: number]: Map<string, number> } = {}; // name -> line number

    // Method tracking for duplicate detection
    const methodDeclarations: { [depth: number]: Map<string, number> } = {}; // signature -> line number

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

      // Top-level statement detection (only for method calls and assignments)
      if (
        braceDepth === 0 &&
        !/^(package|import)\b/.test(trimmedLine) &&
        !/^(@\w+)/.test(trimmedLine) &&
        !/^(public|private|protected)\s+(class|interface)\b/.test(
          trimmedLine
        ) &&
        !/^(class|interface)\b/.test(trimmedLine) &&
        !/^(public|private|protected)\s+/.test(trimmedLine) && // Allow public methods outside classes
        trimmedLine.endsWith(";") &&
        (/^new\s+/.test(trimmedLine) ||
          /^\w+\s*\(/.test(trimmedLine) || // Method calls
          /^\w+[\w<>\[\],\s]*\s+\w+\s*=/.test(trimmedLine)) // Variable assignments
      ) {
        const afterLastType =
          lastClosingBraceLine !== -1 && lineNumber > lastClosingBraceLine;
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
      // Remove comments from line for semicolon checking
      const lineWithoutComments = line.replace(/\/\/.*$/, "").trim();

      // Skip semicolon checking entirely if the line has comments and ends with semicolon
      if (
        line.includes("//") &&
        line.includes(";") &&
        line.indexOf(";") < line.indexOf("//")
      ) {
        // Line has semicolon before comment, so it's valid - skip semicolon checking
      } else {
        if (
          lineWithoutComments &&
          !lineWithoutComments.startsWith("//") &&
          !lineWithoutComments.startsWith("*") &&
          !lineWithoutComments.endsWith("{") &&
          !lineWithoutComments.endsWith("}") &&
          !lineWithoutComments.endsWith(";") &&
          !lineWithoutComments.includes("class ") &&
          !lineWithoutComments.includes("interface ") &&
          !lineWithoutComments.includes("abstract ") &&
          !lineWithoutComments.includes("public ") &&
          !lineWithoutComments.includes("private ") &&
          !lineWithoutComments.includes("protected ") &&
          !lineWithoutComments.includes("static ") &&
          !lineWithoutComments.includes("import ") &&
          !lineWithoutComments.includes("package ") &&
          !lineWithoutComments.includes("if ") &&
          !lineWithoutComments.includes("else") &&
          !lineWithoutComments.includes("for ") &&
          !lineWithoutComments.includes("while ") &&
          !lineWithoutComments.includes("do ") &&
          !lineWithoutComments.includes("switch ") &&
          !lineWithoutComments.includes("try ") &&
          !lineWithoutComments.includes("catch ") &&
          !lineWithoutComments.includes("finally") &&
          !lineWithoutComments.includes("case ") &&
          !lineWithoutComments.includes("default:") &&
          !lineWithoutComments.includes("break") &&
          !lineWithoutComments.includes("continue") &&
          !lineWithoutComments.includes("return") &&
          !lineWithoutComments.includes("throw") &&
          !lineWithoutComments.includes("synchronized") &&
          !lineWithoutComments.includes("volatile") &&
          !lineWithoutComments.includes("transient") &&
          !lineWithoutComments.includes("native") &&
          !lineWithoutComments.includes("final") &&
          !lineWithoutComments.includes("enum ") &&
          !lineWithoutComments.includes("extends ") &&
          !lineWithoutComments.includes("implements ") &&
          !lineWithoutComments.includes("throws ") &&
          !lineWithoutComments.includes("@") &&
          lineWithoutComments.length > 0
        ) {
          // Check if it looks like a statement that should end with semicolon
          if (
            (lineWithoutComments.includes("System.out.print") &&
              !lineWithoutComments.endsWith(";")) ||
            (lineWithoutComments.includes("=") &&
              !lineWithoutComments.endsWith(";") &&
              !lineWithoutComments.endsWith("{")) ||
            (lineWithoutComments.includes("return") &&
              !lineWithoutComments.endsWith(";")) ||
            (lineWithoutComments.match(/^\s*\w+\s+\w+/) &&
              !lineWithoutComments.endsWith(";") &&
              !lineWithoutComments.endsWith("{")) || // Variable declarations
            (lineWithoutComments.includes("++") &&
              !lineWithoutComments.endsWith(";")) ||
            (lineWithoutComments.includes("--") &&
              !lineWithoutComments.endsWith(";")) ||
            (lineWithoutComments.includes("(") &&
              lineWithoutComments.includes(")") &&
              !lineWithoutComments.includes("{") &&
              !lineWithoutComments.endsWith(";")) // Method calls
          ) {
            errors.push({
              line: lineNumber,
              column: lineWithoutComments.length,
              message: "Missing semicolon",
              explanation:
                "This statement appears to be missing a semicolon ';' at the end.",
            });
          }
        }
      }

      // Update brace depth after this line
      const opens = (line.match(/\{/g) || []).length;
      const closes = (line.match(/\}/g) || []).length;
      braceDepth += opens - closes;

      // Initialize scope tracking for new depth
      if (!variableScopes[braceDepth]) {
        variableScopes[braceDepth] = new Set<string>();
        variableDeclarations[braceDepth] = new Map<string, number>();
      }

      // Clean up deeper scopes when exiting them
      for (const depth of Object.keys(variableScopes)) {
        const depthNum = parseInt(depth);
        if (depthNum > braceDepth) {
          delete variableScopes[depthNum];
          delete variableDeclarations[depthNum];
          delete methodDeclarations[depthNum];
        }
      }

      // Check for variable declarations and detect duplicates
      this.checkVariableDeclarations(
        trimmedLine,
        lineNumber,
        braceDepth,
        variableScopes,
        variableDeclarations,
        errors
      );

      // Check for method declarations and detect duplicates
      this.checkMethodDeclarations(
        trimmedLine,
        lineNumber,
        braceDepth,
        methodDeclarations,
        errors
      );

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

    // Main method is optional - only required if you want to run the program

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

  // Helper method to check for variable declarations and detect duplicates
  private checkVariableDeclarations(
    line: string,
    lineNumber: number,
    braceDepth: number,
    variableScopes: { [depth: number]: Set<string> },
    variableDeclarations: { [depth: number]: Map<string, number> },
    errors: SyntaxError[]
  ): void {
    // Skip comments, imports, package declarations, and class/interface declarations
    if (
      line.startsWith("//") ||
      line.startsWith("/*") ||
      line.startsWith("*") ||
      line.startsWith("import ") ||
      line.startsWith("package ") ||
      line.includes("class ") ||
      line.includes("interface ") ||
      line.includes("public ") ||
      line.includes("private ") ||
      line.includes("protected ")
    ) {
      return;
    }

    // Check for variable declarations
    // Pattern: type variableName [= value];
    // Examples: int x; String name = "test"; double price = 10.5;
    const variableDeclarationRegex =
      /^\s*(?:final\s+)?(?:static\s+)?(?:volatile\s+)?(?:transient\s+)?(int|String|boolean|double|float|char|byte|short|long|Object|var)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*(?:=|;)/;

    const match = line.match(variableDeclarationRegex);
    if (match) {
      const variableName = match[2];

      // Check if variable already exists in current scope or any parent scope
      for (let depth = 0; depth <= braceDepth; depth++) {
        if (variableScopes[depth] && variableScopes[depth].has(variableName)) {
          const originalLine = variableDeclarations[depth]?.get(variableName);
          errors.push({
            line: lineNumber,
            column: line.indexOf(variableName),
            message: `Duplicate variable name: '${variableName}'`,
            explanation: `Variable '${variableName}' is already declared${
              originalLine ? ` on line ${originalLine}` : ""
            }. Variable names must be unique within the same scope.`,
          });
          return;
        }
      }

      // Add variable to current scope
      if (!variableScopes[braceDepth]) {
        variableScopes[braceDepth] = new Set<string>();
        variableDeclarations[braceDepth] = new Map<string, number>();
      }
      variableScopes[braceDepth].add(variableName);
      variableDeclarations[braceDepth].set(variableName, lineNumber);
    }
  }

  // Helper method to check for method declarations and detect duplicates
  private checkMethodDeclarations(
    line: string,
    lineNumber: number,
    braceDepth: number,
    methodDeclarations: { [depth: number]: Map<string, number> },
    errors: SyntaxError[]
  ): void {
    // Skip comments, imports, package declarations
    if (
      line.startsWith("//") ||
      line.startsWith("/*") ||
      line.startsWith("*") ||
      line.startsWith("import ") ||
      line.startsWith("package ") ||
      line.includes("System.out.")
    ) {
      return;
    }

    // Check for method declarations in interfaces and classes
    // Pattern: [modifiers] returnType methodName(params) [throws exceptions];
    // Examples: void starten(); public void stoppen(); @Override public void bewegen(int x, int y)
    const methodDeclarationRegex =
      /^\s*(?:@\w+\s+)?(?:public\s+|private\s+|protected\s+)?(?:static\s+)?(?:final\s+)?(?:abstract\s+)?(?:synchronized\s+)?(void|String|int|boolean|double|float|char|byte|short|long|Object|\w+)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)\s*(?:throws\s+[\w\s,]+)?\s*;?\s*$/;

    const match = line.match(methodDeclarationRegex);
    if (match) {
      const methodName = match[2];

      // Extract parameters from the method signature
      const paramMatch = line.match(/\(([^)]*)\)/);
      const parameters = paramMatch ? paramMatch[1].trim() : "";

      // Create method signature (name + parameters)
      const methodSignature = `${methodName}(${parameters})`;

      // Initialize method declarations map for current depth
      if (!methodDeclarations[braceDepth]) {
        methodDeclarations[braceDepth] = new Map<string, number>();
      }

      // Check if method already exists in current scope or any parent scope
      for (let depth = 0; depth <= braceDepth; depth++) {
        if (
          methodDeclarations[depth] &&
          methodDeclarations[depth].has(methodSignature)
        ) {
          const originalLine = methodDeclarations[depth].get(methodSignature);
          errors.push({
            line: lineNumber,
            column: line.indexOf(methodName),
            message: `Duplicate method declaration: '${methodSignature}'`,
            explanation: `Method '${methodSignature}' is already declared${
              originalLine ? ` on line ${originalLine}` : ""
            }. Method signatures must be unique within the same scope.`,
          });
          return;
        }
      }

      // Add method to current scope
      methodDeclarations[braceDepth].set(methodSignature, lineNumber);
    }
  }
}

// Create and export a singleton instance
export const javaSyntaxChecker = new JavaSyntaxChecker();
