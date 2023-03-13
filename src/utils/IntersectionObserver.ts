import React, { useEffect } from "react";

const defaultOptions = {
  root: document.getElementById("calendar-root"),
  rootMargin: "0px",
  threshold: 1.0,
};

export const useIntersectionObserver = (
  ref: React.RefObject<HTMLDivElement>,
  callback: (entries: IntersectionObserverEntry[]) => void,
  options = defaultOptions
) => {
  useEffect(() => {
    if (ref.current) {
      const observer = new IntersectionObserver(callback, options);
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [callback]);
};
