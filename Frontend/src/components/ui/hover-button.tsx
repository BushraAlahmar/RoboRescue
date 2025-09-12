"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface HoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const HoverButton = React.forwardRef<HTMLButtonElement, HoverButtonProps>(
  ({ className, children, ...props }, ref) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const [isListening, setIsListening] = React.useState(false);
    const [mousePosition, setMousePosition] = React.useState({
      x: 0,
      y: 0,
    });
    const [circles, setCircles] = React.useState<
      Array<{
        id: number;
        x: number;
        y: number;
        color: string;
        fadeState: "in" | "out" | null;
      }>
    >([]);
    const lastAddedRef = React.useRef(0);
    const maxCircles = 3; // Limit number of circles for performance

    React.useImperativeHandle(
      ref,
      () => buttonRef.current as HTMLButtonElement
    );

    const createCircle = React.useCallback((x: number, y: number) => {
      const buttonWidth = buttonRef.current?.offsetWidth || 0;
      const xPos = x / buttonWidth;
      const color = `linear-gradient(to right, var(--circle-start) ${
        xPos * 100
      }%, var(--circle-end) ${xPos * 100}%)`;

      setCircles((prev) => {
        // Limit the number of circles for performance
        const newCircles = [
          ...prev,
          { id: Date.now(), x, y, color, fadeState: null },
        ];
        return newCircles.slice(-maxCircles); // Keep only the last maxCircles
      });
    }, []);

    const handlePointerMove = React.useCallback(
      (event: React.PointerEvent<HTMLButtonElement>) => {
        if (!isListening) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Update mouse position for button movement
        setMousePosition({
          x: (x / rect.width - 0.5) * 10, // Scale factor of 10 for movement
          y: (y / rect.height - 0.5) * 10,
        });

        const currentTime = Date.now();
        // Increased throttle from 100ms to 200ms for better performance
        if (currentTime - lastAddedRef.current > 200) {
          lastAddedRef.current = currentTime;
          createCircle(x, y);
        }
      },
      [isListening, createCircle]
    );

    const handlePointerEnter = React.useCallback(() => {
      setIsListening(true);
    }, []);

    const handlePointerLeave = React.useCallback(() => {
      setIsListening(false);
      setMousePosition({ x: 0, y: 0 }); // Reset position when mouse leaves
    }, []);

    React.useEffect(() => {
      circles.forEach((circle) => {
        if (!circle.fadeState) {
          // Reduced timeout durations for faster cleanup
          setTimeout(() => {
            setCircles((prev) =>
              prev.map((c) =>
                c.id === circle.id ? { ...c, fadeState: "in" } : c
              )
            );
          }, 0);

          setTimeout(() => {
            setCircles((prev) =>
              prev.map((c) =>
                c.id === circle.id ? { ...c, fadeState: "out" } : c
              )
            );
          }, 800); // Reduced from 1000ms

          setTimeout(() => {
            setCircles((prev) => prev.filter((c) => c.id !== circle.id));
          }, 1600); // Reduced from 2200ms
        }
      });
    }, [circles]);

    return (
      <button
        ref={buttonRef}
        className={cn(
          "relative isolate px-8 py-3",
          "text-white font-normal text-base",
          "cursor-pointer overflow-hidden",
          "rounded-[2rem]",
          "bg-gradient-to-r from-metallic-dark/30 to-metallic-dark/20",
          "border border-metallic-light/10",
          "shadow-[0_8px_32px_0_rgba(202,94,21,0.15)]",
          "backdrop-blur-[4px]",
          "transition-all duration-400 ease-out",
          // Hover effects
          "hover:bg-gradient-to-r hover:from-metallic-accent/20 hover:to-metallic-accent/10",
          "hover:border-metallic-light/20",
          "hover:shadow-[0_8px_32px_0_rgba(202,94,21,0.25)]",
          // Glass effect
          "before:content-[''] before:absolute before:inset-0",
          "before:rounded-[inherit] before:pointer-events-none",
          "before:z-[1]",
          "before:bg-gradient-to-b before:from-metallic-light/10 before:to-transparent",
          "before:opacity-50",
          "before:transition-all before:duration-300",
          "hover:before:opacity-70",
          // Active state
          "active:scale-[0.98]",
          "active:shadow-[0_4px_16px_0_rgba(202,94,21,0.15)] whitespace-nowrap",
          className
        )}
        style={{
          ...props.style,
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          ["--circle-start" as string]: "var(--tw-gradient-from, #ca5e15)",
          ["--circle-end" as string]: "var(--tw-gradient-to, #bba98e)",
        }}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        {...props}
      >
        {circles.map(({ id, x, y, color, fadeState }) => (
          <span
            key={id}
            className={cn(
              "absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full",
              "blur-lg pointer-events-none z-[-1] transition-opacity duration-300",
              fadeState === "in" && "opacity-75",
              fadeState === "out" && "opacity-0 duration-[1.2s]",
              !fadeState && "opacity-0"
            )}
            style={{
              left: x,
              top: y,
              background: color,
            }}
          />
        ))}
        {children}
      </button>
    );
  }
);

HoverButton.displayName = "HoverButton";

export { HoverButton };
