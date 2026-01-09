import { useEffect, useState } from 'react';

export const useCountdownTimer = (endTime: string | Date) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    formatted: string;
    isEnded: boolean;
  }>(() => calculateTimeLeft(endTime));

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(endTime));
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return timeLeft;
};

function calculateTimeLeft(endTime: string | Date) {
  const end = new Date(endTime);
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formatted: 'Auction Ended',
      isEnded: true,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const formatted = `${days}d ${hours}h ${minutes}m ${seconds}s`;

  return {
    days,
    hours,
    minutes,
    seconds,
    formatted,
    isEnded: false,
  };
}
