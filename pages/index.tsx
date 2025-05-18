// pages/index.tsx
"use client";

import { useEffect, useState } from "react";
import {
  format,
  getDaysInMonth,
  startOfMonth,
  addDays,
  subMonths,
  addMonths,
  getDay,
  isAfter,
  isEqual
} from "date-fns";

export default function Home() {
  const [checkedDates, setCheckedDates] = useState<Record<string, boolean>>({});
  const [targetDate, setTargetDate] = useState(new Date());

  const dateKey = (date: Date) => format(date, "yyyy-MM-dd");

  const getTargetMonthDates = () => {
    const start = startOfMonth(targetDate);
    const daysInMonth = getDaysInMonth(start);
    return Array.from({ length: daysInMonth }, (_, i) => addDays(start, i));
  };

  useEffect(() => {
    const stored = localStorage.getItem("smoke-tracker");
    if (stored) setCheckedDates(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("smoke-tracker", JSON.stringify(checkedDates));
  }, [checkedDates]);

  const toggleDate = (date: Date) => {
    const key = dateKey(date);
    setCheckedDates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const targetDates = getTargetMonthDates();

  const startTrackingDate = new Date("2025-05-14");
  const today = new Date();

  const allTrackingDates: Date[] = [];
  for (let d = new Date(startTrackingDate); !isAfter(d, today); d.setDate(d.getDate() + 1)) {
    allTrackingDates.push(new Date(d));
  }

  const totalDays = allTrackingDates.length;
  const cleanDays = Object.values(checkedDates).filter((v) => v).length;
  const savedMoney = cleanDays * 5000;

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="min-h-screen p-4 bg-white text-black flex flex-col items-center">
      <div className="text-center text-lg font-semibold text-pink-600 mb-4">예린아 환이를 응원해줘!!!! 💪💖</div>
    <main className="min-h-screen p-4 bg-white text-black flex justify-center">
      <div className="w-[360px]">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setTargetDate((prev) => subMonths(prev, 1))}
            className="px-2 py-1 border rounded"
          >
            ◀
          </button>
          <h1 className="text-xl font-bold">{format(targetDate, "yyyy-MM")} 금연 캘린더</h1>
          <button
            onClick={() => setTargetDate((prev) => addMonths(prev, 1))}
            className="px-2 py-1 border rounded"
          >
            ▶
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold">
          {weekdays.map((day, idx) => (
            <div
              key={day}
              className={
                idx === 0 ? "text-red-500" : idx === 6 ? "text-blue-500" : ""
              }
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {(() => {
            const firstDay = getDay(startOfMonth(targetDate));
            const blanks = Array.from({ length: firstDay }, (_, i) => <div key={`blank-${i}`} />);
            return [
              ...blanks,
              ...targetDates.map((d) => {
                const key = dateKey(d);
                const checked = checkedDates[key];
                const dayOfWeek = getDay(d);
                const textColor =
                  dayOfWeek === 0
                    ? "text-red-500"
                    : dayOfWeek === 6
                    ? "text-blue-500"
                    : "";

                return (
                  <button
                    key={key}
                    onClick={() => toggleDate(d)}
                    className={`rounded p-2 border ${checked ? "bg-green-400" : "bg-gray-200"} ${textColor}`}
                  >
                    {format(d, "d")}
                  </button>
                );
              }),
            ];
          })()}
        </div>

        <div className="mt-6 text-lg">
          <p>
            총 <strong>{totalDays}</strong>일 중 <strong>{cleanDays}</strong>일 금연!
          </p>
          <p>
            맥북까지 <strong>3,000,000</strong>원 중 <strong>{savedMoney.toLocaleString()}</strong>원 절약!
          </p>
        </div>
      </div>
    </main>
    </div>
  );
}
