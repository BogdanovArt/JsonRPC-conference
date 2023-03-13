import { useEffect, useState } from "react";
import { formatDuration } from "utils/formatDuration";

interface Props {
  startDate: number;
}

export const Timer = ({ startDate }: Props) => {
  const [duration, setDuration] = useState(0);
  useEffect(() => {
    let counter: ReturnType<typeof setInterval> = null;
    setDuration((Date.now() - startDate) / 1000);
    counter = setInterval(() => {
      setDuration((Date.now() - startDate) / 1000);
    }, 1000);
    return () => {
      clearInterval(counter);
      counter = null;
    }
  }, [])
  return <div style={{ minWidth: 40 }}> {formatDuration(duration)}</div>;
};
