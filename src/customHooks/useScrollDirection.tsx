import { useState, useEffect, RefObject } from "react";

export default function useScrollDirection(elementRef: RefObject<HTMLElement>, threshold: number): boolean {
  const [isUserScrollingUp, setIsUserScrollingUp] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    if (elementRef.current === null) return;
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScrollTop > lastScrollTop) {
        if (currentScrollTop > threshold && isUserScrollingUp) {
          setIsUserScrollingUp(false);
        }
      } else {
        if (currentScrollTop < threshold && !isUserScrollingUp) {
          setIsUserScrollingUp(true);
        }
      }

      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop); // For Mobile or negative scrolling
    };

    elementRef.current.addEventListener("scroll", handleScroll);

    return () => {
      elementRef.current.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop, isUserScrollingUp, threshold, elementRef.current]);

  return isUserScrollingUp;
}
