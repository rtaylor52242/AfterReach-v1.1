import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarEvent {
  date: string;
  title: string;
  type: 'legal' | 'personal';
}

export const Calendar: React.FC = () => {
  // Start with November 2023 to match the initial mock data context
  const [currentDate, setCurrentDate] = useState(new Date(2023, 10, 1)); // Month is 0-indexed (10 = Nov)

  const events: CalendarEvent[] = [
    { date: '2023-11-08', title: 'Clean guest room', type: 'personal' },
    { date: '2023-11-10', title: 'Funeral Service', type: 'legal' },
    { date: '2023-11-15', title: 'Death Certs Due', type: 'legal' },
    { date: '2023-11-28', title: 'Meet Attorney', type: 'legal' },
    { date: '2023-12-05', title: 'Pick up Urn', type: 'personal' },
    { date: '2023-12-12', title: 'Estate Tax Filing', type: 'legal' },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const getEventsForDay = (day: number) => {
    const monthStr = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    return events.filter(e => e.date === dateStr);
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
          <div>
             <h1 className="text-3xl font-bold text-ar-text dark:text-ar-dark-text">{monthName} {year}</h1>
             <p className="text-ar-accent dark:text-ar-dark-accent">Manage appointments and deadlines.</p>
          </div>
          <div className="flex gap-2">
             <button 
                onClick={handlePrevMonth}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-ar-beige dark:border-gray-600"
                aria-label="Previous Month"
             >
                <ChevronLeft size={20} />
             </button>
             <button 
                onClick={handleNextMonth}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-ar-beige dark:border-gray-600"
                aria-label="Next Month"
             >
                <ChevronRight size={20} />
             </button>
          </div>
       </div>

       <div className="bg-white dark:bg-ar-dark-card rounded-2xl shadow-sm border border-ar-beige dark:border-gray-700 overflow-hidden flex-1 flex flex-col">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
             {days.map(day => (
                 <div key={day} className="py-3 text-center font-semibold text-ar-accent text-sm uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50">
                     {day}
                 </div>
             ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 flex-1 auto-rows-fr">
              {/* Empty slots for previous month */}
              {blanks.map((_, i) => (
                  <div key={`blank-${i}`} className="border-b border-r border-gray-100 dark:border-gray-700 min-h-[100px] bg-gray-50/30 dark:bg-gray-900/20"></div>
              ))}
              
              {/* Days */}
              {monthDays.map(day => {
                  const dayEvents = getEventsForDay(day);
                  const isToday = new Date().toDateString() === new Date(year, currentDate.getMonth(), day).toDateString();
                  
                  return (
                      <div key={day} className={`border-b border-r border-gray-100 dark:border-gray-700 min-h-[100px] p-2 relative group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isToday ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                          <span className={`
                            block font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full text-sm
                            ${isToday ? 'bg-ar-taupe text-white' : 'text-ar-text dark:text-ar-dark-text'}
                          `}>{day}</span>
                          
                          <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                              {dayEvents.map((ev, idx) => (
                                  <div 
                                    key={idx} 
                                    className={`
                                        text-xs p-1 px-2 rounded truncate cursor-pointer hover:opacity-80 transition-opacity font-medium
                                        ${ev.type === 'legal' 
                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border border-blue-200 dark:border-blue-800' 
                                            : 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200 border border-green-200 dark:border-green-800'}
                                    `}
                                    title={ev.title}
                                  >
                                      {ev.title}
                                  </div>
                              ))}
                          </div>
                      </div>
                  );
              })}
          </div>
       </div>
    </div>
  );
};