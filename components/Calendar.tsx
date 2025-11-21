
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Save, Calendar as CalendarIcon, Star } from 'lucide-react';
import { CalendarEvent } from '../types';

interface CalendarProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ events, onAddEvent }) => {
  // Initialize with the actual current date
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [holidayAlert, setHolidayAlert] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<{
    title: string;
    date: string;
    type: CalendarEvent['type'];
  }>({
    title: '',
    date: '',
    type: 'personal'
  });

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

  const handleDayDoubleClick = (day: number) => {
    const year = currentDate.getFullYear();
    const monthStr = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const formattedDate = `${year}-${monthStr}-${dayStr}`;

    setNewEvent({
        title: '',
        date: formattedDate,
        type: 'personal'
    });
    setIsModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;

    onAddEvent({
        title: newEvent.title,
        date: newEvent.date,
        type: newEvent.type
    });

    setIsModalOpen(false);
  };

  const getEventColor = (type: CalendarEvent['type']) => {
    switch (type) {
        case 'legal':
            return 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200 border border-rose-200 dark:border-rose-800';
        case 'personal':
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 border border-purple-200 dark:border-purple-800';
        case 'household':
            return 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200 border border-green-200 dark:border-green-800';
        case 'pet':
            return 'bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-200 border border-orange-200 dark:border-orange-800';
        case 'admin':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border border-blue-200 dark:border-blue-800';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700/60 dark:text-gray-200 border border-gray-200 dark:border-gray-600';
    }
  };

  // Simple helper for fixed-date holidays
  const getHolidayName = (day: number, monthIndex: number) => {
      // monthIndex is 0-11
      const key = `${monthIndex + 1}-${day}`;
      const holidays: Record<string, string> = {
          '1-1': "New Year's Day",
          '2-14': "Valentine's Day",
          '3-17': "St. Patrick's Day",
          '7-4': "Independence Day",
          '10-31': "Halloween",
          '11-11': "Veterans Day",
          '12-24': "Christmas Eve",
          '12-25': "Christmas Day",
          '12-31': "New Year's Eve"
      };
      return holidays[key] || null;
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

  const renderHolidayAlert = () => {
    if (!holidayAlert) return null;
    return (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-ar-dark-card rounded-2xl p-6 max-w-sm w-full shadow-xl border border-ar-beige dark:border-gray-700 text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                    <Star size={24} fill="currentColor" />
                </div>
                <h3 className="text-lg font-bold text-ar-text dark:text-ar-dark-text mb-2">Holiday</h3>
                <p className="text-ar-text dark:text-white text-xl font-medium mb-6">{holidayAlert}</p>
                <button 
                    onClick={() => setHolidayAlert(null)}
                    className="w-full py-2 px-4 bg-ar-taupe text-white rounded-lg hover:bg-opacity-90"
                >
                    Close
                </button>
            </div>
        </div>
    );
  };

  const renderAddEventModal = () => {
    if (!isModalOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-ar-dark-card rounded-2xl max-w-md w-full shadow-xl border border-ar-beige dark:border-gray-700">
                <div className="p-6 border-b border-ar-beige dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-ar-text dark:text-ar-dark-text">Add Event</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-ar-accent hover:text-ar-text dark:hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-ar-accent mb-1">Event Title</label>
                        <input 
                            autoFocus
                            required
                            type="text"
                            value={newEvent.title}
                            onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                            placeholder="e.g. Meeting with Attorney"
                            className="w-full p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-ar-accent mb-1">Date</label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                required
                                type="date"
                                value={newEvent.date}
                                onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                                className="w-full pl-10 p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-ar-accent mb-1">Type</label>
                        <select
                            value={newEvent.type}
                            onChange={(e) => setNewEvent({...newEvent, type: e.target.value as CalendarEvent['type']})}
                            className="w-full p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white appearance-none"
                        >
                            <option value="personal">Personal</option>
                            <option value="legal">Legal</option>
                            <option value="household">Household</option>
                            <option value="pet">Pet</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button 
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-ar-text dark:text-ar-dark-text font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 bg-ar-taupe text-white rounded-lg hover:bg-opacity-90 shadow-md flex items-center gap-2"
                        >
                            <Save size={18} /> Save Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
  };

  return (
    <div className="h-full flex flex-col relative">
       {renderAddEventModal()}
       {renderHolidayAlert()}

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
                  // Compare full date strings to ensure correct "Today" highlighting
                  const currentDayDate = new Date(year, currentDate.getMonth(), day);
                  const isToday = new Date().toDateString() === currentDayDate.toDateString();
                  const holidayName = getHolidayName(day, currentDate.getMonth());
                  
                  return (
                      <div 
                        key={day} 
                        onDoubleClick={() => handleDayDoubleClick(day)}
                        className={`
                            border-b border-r border-gray-100 dark:border-gray-700 min-h-[100px] p-2 relative group 
                            hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer
                            ${isToday ? 'bg-ar-taupe/5 dark:bg-ar-taupe/10' : ''}
                        `}
                        title="Double-click to add event"
                      >
                          {holidayName && (
                              <div 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setHolidayAlert(holidayName);
                                }}
                                className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 shadow-sm cursor-pointer hover:scale-150 transition-transform" 
                                title={holidayName}
                              />
                          )}
                          
                          <span className={`
                            block font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full text-sm transition-all
                            ${isToday ? 'bg-ar-taupe text-white shadow-md' : 'text-ar-text dark:text-ar-dark-text'}
                          `}>{day}</span>
                          
                          <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                              {dayEvents.map((ev, idx) => (
                                  <div 
                                    key={idx} 
                                    className={`
                                        text-xs p-1 px-2 rounded truncate cursor-pointer hover:opacity-80 transition-opacity font-medium
                                        ${getEventColor(ev.type)}
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
