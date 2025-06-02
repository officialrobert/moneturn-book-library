import { useRef } from 'react';

type UseDebounceCallbackReturnType<T extends unknown[]> = (
  // eslint-disable-next-line
  ...args: T
) => Promise<
  void | null | number | string | boolean | Record<string, unknown> | T
>;

// eslint-disable-next-line
type CallBackFunc<T extends unknown[]> = (
  ...args: T
) => Promise<
  void | null | number | string | boolean | Record<string, unknown> | T
>;

/**
 * Debounce callback function to delay triggers
 * @param cb
 * @param delay
 * @returns
 */
const useDebounce = <T extends unknown[]>(
  cb: CallBackFunc<T>,
  delay: number,
): UseDebounceCallbackReturnType<T> => {
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  // @ts-expect-error yea no type
  return function debounce(...args) {
    clearTimeout(timeoutId.current as NodeJS.Timeout);

    timeoutId.current = setTimeout(() => {
      cb(...args);
      clearTimeout(timeoutId.current as NodeJS.Timeout);
    }, delay || 100);
  };
};

export { useDebounce };
