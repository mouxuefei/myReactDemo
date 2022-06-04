import { useEffect, useRef } from 'react';

/**
 * 计时器
 * @param callback
 * @param delay
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>();

  /**
   * 记录最新的function
   */
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  /**
   * 设置计时器
   */
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    } else {
      return () => {};
    }
  }, [delay]);
}
