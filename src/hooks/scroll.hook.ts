import { useEffect, useState } from 'react';

export interface Scroll {
  x: number;
  y: number;
}

export function useScroll(target?: Element) {
  const [scroll, setScroll] = useState<Scroll>({
    x: target?.scrollLeft ?? window.scrollX,
    y: target?.scrollTop ?? window.scrollX,
  });

  useEffect(() => {
    (target ?? window).addEventListener('scroll', handleResize);

    return () => {
      (target ?? window).removeEventListener('scroll', handleResize);
    };
  }, [handleResize, target]);

  function handleResize() {
    setScroll({
      x: target?.scrollLeft ?? window.scrollX,
      y: target?.scrollTop ?? window.scrollX,
    });
  }

  return scroll;
}
