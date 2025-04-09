import { useCallback, useRef, useEffect } from 'react';

function useDebouncer<T extends (...args: any[]) => void>(callback: T, delay: number): T {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunction = useCallback((...args: Parameters<T>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      callback(...args);
      timerRef.current = null;
    }, delay);
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return debouncedFunction as T;
}

export default useDebouncer;
