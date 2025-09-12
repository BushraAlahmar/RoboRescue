"use client";

import {
    useState,
    useCallback,
    useRef,
    useEffect,
    createContext,
    useContext,
    ReactNode,
} from "react";

interface RobotToastState {
    isVisible: boolean;
    message: string;
    showStartButton: boolean;
    showCloseButton: boolean;
    onStart?: () => void;
}

interface UseRobotToastReturn {
    toastState: RobotToastState;
    showToast: (
        message: string,
        options?: {
            duration?: number;
            showStartButton?: boolean;
            showCloseButton?: boolean;
            onStart?: () => void;
        }
    ) => void;
    hideToast: () => void;
    isVisible: boolean;
}

// Create the context
const RobotToastContext = createContext<UseRobotToastReturn | undefined>(
    undefined
);

// Provider component
export function RobotToastProvider({ children }: { children: ReactNode }) {
    const [toastState, setToastState] = useState<RobotToastState>({
        isVisible: false,
        message: "",
        showStartButton: false,
        showCloseButton: true,
        onStart: undefined,
    });

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const hideToast = useCallback(() => {
        setToastState((prev) => ({
            ...prev,
            isVisible: false,
        }));

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const showToast = useCallback(
        (
            message: string,
            options: {
                duration?: number;
                showStartButton?: boolean;
                showCloseButton?: boolean;
                onStart?: () => void;
            } = {}
        ) => {
            const {
                duration = 5000,
                showStartButton = false,
                showCloseButton = true,
                onStart,
            } = options;

            // Clear any existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            setToastState({
                isVisible: true,
                message,
                showStartButton,
                showCloseButton,
                onStart: onStart || (() => hideToast()),
            });

            // Auto-hide after duration (if duration > 0)
            if (duration > 0) {
                timeoutRef.current = setTimeout(() => {
                    hideToast();
                }, duration);
            }
        },
        [hideToast]
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const value = {
        toastState,
        showToast,
        hideToast,
        isVisible: toastState.isVisible,
    };

    return (
        <RobotToastContext.Provider value={value}>
            {children}
        </RobotToastContext.Provider>
    );
}

// Hook to use the global robot toast
export function useGlobalRobotToast(): UseRobotToastReturn {
    const context = useContext(RobotToastContext);
    if (context === undefined) {
        throw new Error(
            "useGlobalRobotToast must be used within a RobotToastProvider"
        );
    }
    return context;
}

// Extended hook with additional methods
export function useAdvancedRobotToast() {
    const { showToast, hideToast, toastState, isVisible } =
        useGlobalRobotToast();

    return {
        showToast,
        hideToast,
        toastState,
        isVisible,
        showPersistentToast: (
            message: string,
            options?: {
                showStartButton?: boolean;
                showCloseButton?: boolean;
                onStart?: () => void;
            }
        ) => {
            showToast(message, {
                duration: 0, // Won't auto-hide
                showStartButton: options?.showStartButton,
                showCloseButton: options?.showCloseButton,
                onStart: options?.onStart,
            });
        },
        closePersistentToast: hideToast,
    };
}

// Simple convenience hook for showing robot toasts
export function useRobotMessage() {
    const { showToast, hideToast } = useGlobalRobotToast();

    return {
        showRobotMessage: (
            message: string,
            duration = 5000,
            showCloseButton = true
        ) => {
            showToast(message, { duration, showCloseButton });
        },
        showRobotWelcome: (message: string, showCloseButton = true) => {
            showToast(message, { duration: 8000, showCloseButton });
        },
        showRobotSuccess: (message: string, showCloseButton = true) => {
            showToast(message, { duration: 5000, showCloseButton });
        },
        showRobotError: (message: string, showCloseButton = true) => {
            showToast(message, { duration: 10000, showCloseButton });
        },
        showRobotPersistent: (
            message: string,
            options?: {
                showStartButton?: boolean;
                showCloseButton?: boolean;
                onStart?: () => void;
            }
        ) => {
            showToast(message, {
                duration: 0, // 0 means it won't auto-hide
                showStartButton: options?.showStartButton,
                showCloseButton: options?.showCloseButton !== false, // Default to true
                onStart: options?.onStart,
            });
        },
        hideRobotMessage: hideToast,
        closeRobotMessage: hideToast, // Alias for clarity when closing persistent messages
    };
}

// Keep the old hook for backward compatibility
export function useRobotToast(): UseRobotToastReturn {
    const [toastState, setToastState] = useState<RobotToastState>({
        isVisible: false,
        message: "",
        showStartButton: false,
        showCloseButton: true,
        onStart: undefined,
    });

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const hideToast = useCallback(() => {
        setToastState((prev) => ({
            ...prev,
            isVisible: false,
        }));

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const showToast = useCallback(
        (
            message: string,
            options: {
                duration?: number;
                showStartButton?: boolean;
                showCloseButton?: boolean;
                onStart?: () => void;
            } = {}
        ) => {
            const {
                duration = 5000,
                showStartButton = false,
                showCloseButton = true,
                onStart,
            } = options;

            // Clear any existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            setToastState({
                isVisible: true,
                message,
                showStartButton,
                showCloseButton,
                onStart: onStart || (() => hideToast()),
            });

            // Auto-hide after duration (if duration > 0)
            if (duration > 0) {
                timeoutRef.current = setTimeout(() => {
                    hideToast();
                }, duration);
            }
        },
        [hideToast]
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return {
        toastState,
        showToast,
        hideToast,
        isVisible: toastState.isVisible,
    };
}
