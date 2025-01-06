import { useState, useCallback } from "react";

interface RetryConfig {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

interface RetryState {
  isLoading: boolean;
  error: Error | null;
  retryCount: number;
}

export const useRetry = <T>({
  maxRetries = 3,
  initialDelay = 1000,
  maxDelay = 10000,
  backoffFactor = 2,
}: RetryConfig = {}) => {
  const [state, setState] = useState<RetryState>({
    isLoading: false,
    error: null,
    retryCount: 0,
  });

  const executeWithRetry = useCallback(
    async (asyncFn: () => Promise<T>): Promise<T> => {
      setState({ isLoading: true, error: null, retryCount: 0 });

      const attempt = async (retryCount: number): Promise<T> => {
        try {
          const result = await asyncFn();
          setState((prev) => ({ ...prev, isLoading: false }));
          return result;
        } catch (error) {
          if (retryCount >= maxRetries) {
            setState({
              isLoading: false,
              error: error as Error,
              retryCount,
            });
            throw error;
          }

          const delay = Math.min(
            initialDelay * Math.pow(backoffFactor, retryCount),
            maxDelay,
          );

          await new Promise((resolve) => setTimeout(resolve, delay));
          setState((prev) => ({ ...prev, retryCount: retryCount + 1 }));
          return attempt(retryCount + 1);
        }
      };

      return attempt(0);
    },
    [maxRetries, initialDelay, maxDelay, backoffFactor],
  );

  return {
    executeWithRetry,
    isLoading: state.isLoading,
    error: state.error,
    retryCount: state.retryCount,
  };
};
