import { useEffect, useLayoutEffect } from 'react';

export const useScrollPosition = (key) => {
  useLayoutEffect(() => {
    const savedPosition = sessionStorage.getItem(key);
    if (savedPosition !== null) {
      window.scrollTo(0, parseFloat(savedPosition));
      sessionStorage.removeItem(key);
    }
  }, [key]);

  useEffect(() => {
    return () => {
      sessionStorage.setItem(key, window.scrollY);
    };
  }, [key]);
};
