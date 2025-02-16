'use client';

import * as React from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';

import {eachDayOfInterval, getWeek} from 'date-fns';
import {useState, useEffect} from 'react';

type WeekCalendarProps = {
  selectedDay?: number;
  setSelectedDay?: (day: number) => void;
};

function WeekCalendar({selectedDay, setSelectedDay}: WeekCalendarProps) {
  const selectedDayHandler = (day: number) => {
    if (setSelectedDay) {
      setSelectedDay(day);
    }
  };

  const [daysOfWeek, setDaysOfWeek] = useState<Date[] | null>(null);

  useEffect(() => {
    const firstDayOfWeek = new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay())
    );
    const lastDayOfWeek = new Date(
      new Date().setDate(new Date().getDate() + (6 - new Date().getDay()))
    );
    setDaysOfWeek(
      eachDayOfInterval({start: firstDayOfWeek, end: lastDayOfWeek})
    );
  }, []);

  const goToNextWeek = () => {
    const firstDayOfWeek = new Date(
      new Date(daysOfWeek![6]).setDate(new Date(daysOfWeek![6]).getDate() + 1)
    );
    const lastDayOfWeek = new Date(
      new Date(firstDayOfWeek).setDate(new Date(firstDayOfWeek).getDate() + 6)
    );
    setDaysOfWeek(
      eachDayOfInterval({start: firstDayOfWeek, end: lastDayOfWeek})
    );
  };

  const goToPreviousWeek = () => {
    const firstDayOfWeek = new Date(
      new Date(daysOfWeek![0]).setDate(new Date(daysOfWeek![0]).getDate() - 7)
    );
    const lastDayOfWeek = new Date(
      new Date(firstDayOfWeek).setDate(new Date(firstDayOfWeek).getDate() + 6)
    );
    setDaysOfWeek(
      eachDayOfInterval({start: firstDayOfWeek, end: lastDayOfWeek})
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div>
      {daysOfWeek && (
        <>
          <div className='flex justify-center mt-2'>
            {daysOfWeek[0].toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </div>
          <div className='flex justify-center'>
            <button onClick={goToPreviousWeek} className='rounded-full p-2'>
              <ChevronLeft className='h-4 w-4' />
            </button>
            <div className='flex justify-between'>
              {daysOfWeek.map((day) => (
                <button
                  key={day.toString()}
                  className={`p-2 ${isToday(day) ? 'bg-gray-200' : ''} ${
                    selectedDay === day.getDate() ? '!bg-blue-200' : ''
                  }`}
                  onClick={() => selectedDayHandler(day.getDate())}
                >
                  <div className='flex flex-col items-center'>
                    <small>
                      {day.toLocaleDateString('en-US', {weekday: 'short'})}
                    </small>
                    {day.getDate()}
                  </div>
                </button>
              ))}
            </div>
            <button onClick={goToNextWeek} className='rounded-full p-2'>
              <ChevronRight className='h-4 w-4' />
            </button>
          </div>
          <div className='flex justify-center'>
            {getWeek(daysOfWeek[0])} week of the year
          </div>
        </>
      )}
    </div>
  );
}
WeekCalendar.displayName = 'Week Calendar';

export {WeekCalendar};
