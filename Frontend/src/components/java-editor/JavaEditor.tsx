"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import "./java-editor.css";
import { javaSyntaxChecker } from "@/lib/javaSyntaxChecker";
import { useRobotMessage } from "@/app/[locale]/hooks/useRobotToast";
import { useTranslations } from "next-intl";

interface JavaEditorProps {
  title?: string;
  description?: string;
  initialValue?: string;
  readOnly?: boolean;
  onChange?: (value: string | undefined) => void;
  theme?: string;
  fontSize?: number;
  showMinimap?: boolean;
  defaultCode?: string;
  enableSyntaxCheck?: boolean;
  showToastErrors?: boolean;
  showErrorsAfterRun?: boolean;
}

const DEFAULT_CODE = "";

const JavaEditor: React.FC<JavaEditorProps> = ({
  title,
  description,
  initialValue,
  readOnly = false,
  onChange,
  theme = "vs-dark",
  fontSize = 14,
  showMinimap = true,
  defaultCode = DEFAULT_CODE,
  enableSyntaxCheck = true,
}) => {
  const [displayedCode, setDisplayedCode] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCode, setCurrentCode] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Add the robot toast hook and translations
  const { showRobotPersistent } = useRobotMessage();
  const t = useTranslations("level.robot.syntaxCheck");

  // Process the code to replace \n with actual newlines
  const processCode = (code: string) => {
    return code.replace(/\\n/g, "\n");
  };

  // Use initialValue if provided, otherwise use defaultCode
  const codeToDisplay = processCode(initialValue || defaultCode);

  // Skip typewriter effect if readOnly is true
  const shouldUseTypewriter = !readOnly;

  // Function to check syntax and show results
  const checkSyntaxAndShowResults = useCallback(
    (code: string) => {
      if (!enableSyntaxCheck) {
        return;
      }

      if (!code.trim()) {
        const errorMessage = t("emptyCode");
        console.log("🔍 Syntax Check - Empty Code:", errorMessage);
        showRobotPersistent(errorMessage, {
          showCloseButton: true,
        });
        return;
      }

      const validation = javaSyntaxChecker.validateSyntax(code);

      // Console log the validation result for debugging
      console.log("🔍 Syntax Check Result:", {
        isValid: validation.isValid,
        errorCount: validation.errors.length,
        codeLength: code.length,
        timestamp: new Date().toISOString(),
      });

      // Show persistent toast message based on validation result
      if (!validation.isValid) {
        const errorCount = validation.errors.length;

        // Create detailed error message with line numbers and explanations
        let detailedErrorMessage =
          t("errorPrefix", {
            count: errorCount,
            plural: errorCount > 1 ? "s" : "",
          }) + "\n\n";

        validation.errors.forEach((error, index) => {
          detailedErrorMessage += `${index + 1}. ${t("errorDetails", {
            line: error.line,
            column: error.column,
            message: error.message,
          })}\n`;
          detailedErrorMessage += `   ${t("explanation", {
            explanation: error.explanation,
          })}\n\n`;
        });

        // Remove the last double newline
        detailedErrorMessage = detailedErrorMessage.trim();

        // Console log each individual error for detailed debugging
        console.log("❌ Syntax Errors Found:");
        validation.errors.forEach((error, index) => {
          console.log(`  Error ${index + 1}:`, {
            line: error.line,
            column: error.column,
            message: error.message,
            explanation: error.explanation,
          });
        });

        showRobotPersistent(detailedErrorMessage, {
          showCloseButton: false,
        });
      } else {
        const successMessage = t("success");
        console.log("✅ Syntax Check - Success:", successMessage);
        showRobotPersistent(successMessage, {
          showCloseButton: false,
        });
      }
    },
    [enableSyntaxCheck, showRobotPersistent, t]
  );

  // Handle editor change
  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      const newValue = value || "";
      setCurrentCode(newValue);

      if (onChange) {
        onChange(value);
      }
    },
    [onChange]
  );

  // Reset typing state when code changes
  useEffect(() => {
    setDisplayedCode("");
    setCurrentIndex(0);
    setIsTyping(false);
  }, [codeToDisplay]);

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsTyping(true);
            observer.disconnect(); // Stop observing once animation starts
          }
        });
      },
      {
        threshold: 0.1, // Start animation when 10% of the editor is visible
        rootMargin: "50px", // Start slightly before the element comes into view
      }
    );

    if (editorRef.current) {
      observer.observe(editorRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!isTyping || !shouldUseTypewriter) return;

    const timeout = setTimeout(() => {
      if (currentIndex < codeToDisplay.length) {
        setDisplayedCode((prev) => prev + codeToDisplay[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsTyping(false);
      }
    }, 30);

    return () => clearTimeout(timeout);
  }, [currentIndex, codeToDisplay, isTyping, shouldUseTypewriter]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const currentDebounceRef = debounceRef.current;
      if (currentDebounceRef) {
        clearTimeout(currentDebounceRef);
      }
    };
  }, []);

  // Function to trigger error checking from parent
  const triggerErrorCheck = useCallback(() => {
    checkSyntaxAndShowResults(currentCode);
  }, [currentCode, checkSyntaxAndShowResults]);

  // Expose trigger function to parent
  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).triggerJavaErrorCheck = triggerErrorCheck;
    }
  }, [triggerErrorCheck]);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">{title || ""}</h3>
        <p className="text-sm text-gray-300 max-w-2xl">{description || ""}</p>
      </div>

      <div ref={editorRef} className="java-editor-container flex-1 min-h-0">
        <Editor
          height="500px"
          defaultLanguage="java"
          value={
            isTyping && shouldUseTypewriter ? displayedCode : codeToDisplay
          }
          theme={theme}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: showMinimap },
            fontSize,
            wordWrap: "on",
            automaticLayout: true,
            tabSize: 4,
            padding: { top: 20, bottom: 20 },
            scrollBeyondLastLine: false,
            formatOnPaste: true,
            formatOnType: true,
            glyphMargin: true,
            readOnly,
            // Enhanced syntax error detection
            showUnused: true,
            showDeprecated: true,
            bracketPairColorization: {
              enabled: true,
            },
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: "on",
            acceptSuggestionOnCommitCharacter: true,
            snippetSuggestions: "top",
            wordBasedSuggestions: "matchingDocuments",
            // Better error display
            hover: {
              enabled: true,
              delay: 100,
            },
            // Syntax error highlighting
            renderValidationDecorations: "on",
            renderWhitespace: "selection",
          }}
        />
      </div>
    </div>
  );
};

export default JavaEditor;
