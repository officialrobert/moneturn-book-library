import { useCallback } from 'react';

const useScroll = () => {
  const scrollUp = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return {
    scrollUp,
  };
};

export { useScroll };
