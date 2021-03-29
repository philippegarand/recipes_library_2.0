import { useState, useEffect } from 'react';

const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);

    if (media.matches !== targetReached) {
      setTargetReached(media.matches);
    }

    const listener = () => {
      setTargetReached(media.matches);
    };

    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [targetReached, width]);

  return targetReached;
};
export default useMediaQuery;
