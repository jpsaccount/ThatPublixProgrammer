import { useMotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import useScrollPosition from "./useScrollPosition";

interface Props {
  height: number;
  scrollRef?: React.MutableRefObject<HTMLElement>;
  initialPercentVisible?: number;
}
export default function useHidingOnScroll({ height, scrollRef, initialPercentVisible = 1 }: Props): number {
  const scrollY = useScrollPosition(scrollRef).scrollY;
  const element = scrollRef ? scrollRef.current : window;
  const clientHeight = scrollRef ? scrollRef.current?.clientHeight : document.body.scrollHeight;
  const percentVisible = useMotionValue(initialPercentVisible);
  const [totalScrolled, setTotalScrolled] = useState(0);
  const [baseLine, setBaseLine] = useState(scrollY);
  const componentReady = useRef(false);

  useEffect(() => {
    componentReady.current = false;
    new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
      componentReady.current = true;
    });
  }, [element]);

  const [scrollStartTime, setScrollStartTime] = useState<number | null>(null);
  useEffect(() => {
    if (element === null) return;
    if (componentReady.current === false) return;
    const amountScrolled = baseLine - scrollY;
    if (Math.abs(totalScrolled - amountScrolled) < 5) return;

    const isScrollingUp = amountScrolled > 0;

    const isAtBottom = scrollY >= clientHeight - window.innerHeight;

    if (isScrollingUp && amountScrolled > -height && isAtBottom == false) {
      const percentScrolled = amountScrolled / height;
      const newOpacity = Math.min(1, Math.max(0, percentVisible.get() + percentScrolled));
      percentVisible.set(newOpacity);
    } else if (!isScrollingUp && amountScrolled < 0 && totalScrolled < height && scrollY > height * 5) {
      const percentScrolled = Math.abs(amountScrolled) / height;
      const newOpacity = Math.max(0, Math.min(1, percentVisible.get() - percentScrolled));
      percentVisible.set(newOpacity);
    }

    if (isScrollingUp || amountScrolled === 0) {
      setScrollStartTime(null);
    } else if (scrollStartTime === null && Math.abs(amountScrolled) >= height) {
      setScrollStartTime(new Date().getTime());
    }

    setBaseLine(scrollY);
    setTotalScrolled((x) => x + amountScrolled);
  }, [scrollY]);
  return percentVisible.get() ?? 1;
}
