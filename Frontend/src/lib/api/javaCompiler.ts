import { writeFile, mkdir, rm } from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const execAsync = promisify(exec);

export interface CompilationResult {
    success: boolean;
    output?: string;
    error?: string;
}

const TEMP_BASE_DIR = path.join(process.cwd(), "temp");

function formatError(error: string): string {
    // Split the error message into lines
    const lines = error.split("\n");

    // Filter out only truly empty lines, but keep syntax error indicators
    const errorLines = lines.filter(
        (line) =>
            line.trim() &&
            !line.includes("Note:") &&
            !line.includes("warning:")
    );

    // If we have error lines, format them properly
    if (errorLines.length > 0) {
        // Group related error lines together (error message + pointer line)
        const groupedErrors: string[] = [];
        let currentGroup = "";
        
        for (let i = 0; i < errorLines.length; i++) {
            const line = errorLines[i].trim();
            
            // If line contains "^", it's a pointer line, add it to current group
            if (line.includes("^")) {
                if (currentGroup) {
                    currentGroup += "\n" + line;
                }
            } else {
                // If we have a current group, save it and start a new one
                if (currentGroup) {
                    groupedErrors.push(currentGroup);
                }
                currentGroup = line;
            }
        }
        
        // Add the last group if exists
        if (currentGroup) {
            groupedErrors.push(currentGroup);
        }
        
        return groupedErrors.join("\n\n");
    }

    return error.trim();
}

function hasStderr(error: unknown): error is { stderr: string } {
    return (
        typeof error === "object" &&
        error !== null &&
        "stderr" in error &&
        typeof (error as { stderr: unknown }).stderr === "string"
    );
}

export async function compileAndRun(code: string): Promise<CompilationResult> {
    if (!code) {
        return {
            success: false,
            error: "No code provided",
        };
    }

    const tempDir = path.join(TEMP_BASE_DIR, uuidv4());

    try {
        await mkdir(tempDir, { recursive: true });
        const javaFilePath = path.join(tempDir, "Main.java");
        await writeFile(javaFilePath, code);

        try {
            // Compile the Java file
            await execAsync(`javac ${javaFilePath}`);

            // Run the compiled program
            const { stdout, stderr } = await execAsync(
                `java -cp ${tempDir} Main`
            );

            if (stderr) {
                return {
                    success: false,
                    error: formatError(stderr),
                };
            }

            return {
                success: true,
                output: stdout,
            };
        } catch (error: unknown) {
            let formattedError = "Unknown error";
            if (hasStderr(error)) {
                formattedError = formatError(error.stderr);
            } else if (error instanceof Error) {
                formattedError = formatError(error.message);
            }
            return {
                success: false,
                error: formattedError,
            };
        } finally {
            // Clean up
            await rm(tempDir, { recursive: true, force: true });
        }
    } catch (error: unknown) {
        let formattedError = "Unknown error";
        if (error instanceof Error) {
            formattedError = formatError(error.message);
        }
        return {
            success: false,
            error: formattedError,
        };
    }
}
