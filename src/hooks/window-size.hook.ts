import { useEffect, useState } from 'react';

export interface Size {
  width: number;
  height: number;
}

export function useWindowSize() {
  const [size, setSize] = useState<Size>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function handleResize() {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  return size;
}
