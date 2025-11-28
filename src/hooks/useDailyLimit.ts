"use client";

import { useState, useEffect } from "react";

const MAX_DAILY_READINGS = 9999; // Unlimited for testing
const STORAGE_KEY = "cyber_destin_limit";

interface DailyLimitState {
  date: string;
  count: number;
}

export function useDailyLimit() {
  const [readingsLeft, setReadingsLeft] = useState<number>(MAX_DAILY_READINGS);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      const data: DailyLimitState = JSON.parse(stored);
      if (data.date === today) {
        const left = MAX_DAILY_READINGS - data.count;
        setReadingsLeft(left);
        setIsBlocked(left <= 0);
      } else {
        // Reset for new day
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: 0 }));
        setReadingsLeft(MAX_DAILY_READINGS);
        setIsBlocked(false);
      }
    } else {
      // First time user
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: 0 }));
      setReadingsLeft(MAX_DAILY_READINGS);
      setIsBlocked(false);
    }
  }, []);

  const incrementReading = () => {
    const today = new Date().toISOString().split("T")[0];
    const stored = localStorage.getItem(STORAGE_KEY);
    let currentCount = 0;

    if (stored) {
      const data: DailyLimitState = JSON.parse(stored);
      if (data.date === today) {
        currentCount = data.count;
      }
    }

    const newCount = currentCount + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: newCount }));
    
    const left = MAX_DAILY_READINGS - newCount;
    setReadingsLeft(left);
    setIsBlocked(false); // Always allow for testing
  };

  return { readingsLeft, isBlocked, incrementReading };
}
