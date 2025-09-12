import { useEffect, useState, useCallback } from "react";

export function useRobotMessages(messages: string[], totalDuration?: number) {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [active, setActive] = useState(false); // controls when to start

  const messageCount = messages.length;
  const perMessageDuration =
    totalDuration && messageCount > 0
      ? totalDuration / messageCount
      : undefined;

  const next = useCallback(() => {
    if (index < messageCount - 1) {
      setIndex((i) => i + 1);
    } else {
      // Don't hide the last message automatically - keep it visible
      setActive(false);
    }
  }, [index, messageCount]);

  const show = useCallback(() => {
    setIndex(0); // Reset index
    setIsVisible(true); // Show the first message
    setActive(true); // Start the auto-play
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
    setActive(false);
  }, []);

  useEffect(() => {
    if (!perMessageDuration || !isVisible || !active) return;

    const timer = setTimeout(() => next(), perMessageDuration);
    return () => clearTimeout(timer);
  }, [index, perMessageDuration, isVisible, active, next]);

  return {
    currentMessage: messages[index],
    isVisible,
    next,
    show, // Call this to start showing messages
    hide, // Call this to hide the robot
  };
}
