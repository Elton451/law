import { useEffect } from 'react';
import { useLocation } from 'react-router';

/** Scrolls to the section in the URL hash (/#calendario), also after in-app navigation. */
export const useScrollToHash = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [hash]);
};
