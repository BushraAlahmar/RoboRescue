"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Suspense,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Loader from "./loader";

interface NavigationLoaderContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
}

const NavigationLoaderContext = createContext<
  NavigationLoaderContextType | undefined
>(undefined);

export const useNavigationLoader = () => {
  const context = useContext(NavigationLoaderContext);
  if (!context) {
    throw new Error(
      "useNavigationLoader must be used within a NavigationLoaderProvider"
    );
  }
  return context;
};

interface NavigationLoaderProviderProps {
  children: ReactNode;
}

function NavigationLoaderContent({ children }: NavigationLoaderProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);
  const setLoading = (loading: boolean) => setIsLoading(loading);

  useEffect(() => {
    // Start loading when route changes
    startLoading();

    // Stop loading after a short delay
    const timer = setTimeout(() => {
      stopLoading();
    }, 600);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  const contextValue: NavigationLoaderContextType = {
    isLoading,
    setLoading,
    startLoading,
    stopLoading,
  };

  return (
    <NavigationLoaderContext.Provider value={contextValue}>
      {children}
      <AnimatePresence>
        {isLoading && (
          <>
            <Loader />
          </>
        )}
      </AnimatePresence>
    </NavigationLoaderContext.Provider>
  );
}

export default function NavigationLoaderProvider({
  children,
}: NavigationLoaderProviderProps) {
  return (
    <Suspense fallback={<Loader />}>
      <NavigationLoaderContent>{children}</NavigationLoaderContent>
    </Suspense>
  );
}
