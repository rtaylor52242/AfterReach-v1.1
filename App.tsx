

import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Directory } from './components/Directory';
import { Checklist } from './components/Checklist';
import { Tasks } from './components/Tasks';
import { Calendar } from './components/Calendar';
import { Documents } from './components/Documents';
import { AIChat } from './components/AIChat';
import { Settings } from './components/Settings';
import { Help } from './components/Help';
import { Login } from './components/Login';
import { ViewId, LegalTask, CalendarEvent, UserProfile } from './types';
import { INITIAL_LEGAL_TASKS, INITIAL_USER, INITIAL_CALENDAR_EVENTS } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<ViewId>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  // Persistent Data States
  const [legalTasks, setLegalTasks] = useState<LegalTask[]>(INITIAL_LEGAL_TASKS);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);

  // Effect to handle dark mode class on HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  const handleToggleLegalTask = (id: string) => {
    setLegalTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddLegalTask = (task: LegalTask) => {
    setLegalTasks(prev => [task, ...prev]);
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  const handleAddCalendarEvent = (event: CalendarEvent) => {
    setCalendarEvents(prev => [...prev, event]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard legalTasks={legalTasks} onNavigate={setActiveTab} user={user} />;
      case 'directory':
        return <Directory />;
      case 'checklist':
        return <Checklist tasks={legalTasks} onToggleTask={handleToggleLegalTask} onAddTask={handleAddLegalTask} />;
      case 'tasks':
        return <Tasks />;
      case 'calendar':
        return <Calendar events={calendarEvents} onAddEvent={handleAddCalendarEvent} />;
      case 'documents':
        return <Documents />;
      case 'ai-chat':
        return <AIChat />;
      case 'settings':
        return (
          <Settings 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode} 
            onLogout={handleLogout} 
            user={user}
            onUpdateUser={handleUpdateUser}
          />
        );
      case 'help':
        return <Help />;
      default:
        return <Dashboard legalTasks={legalTasks} onNavigate={setActiveTab} user={user} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      onNavigate={setActiveTab} 
      darkMode={darkMode} 
      toggleDarkMode={toggleDarkMode}
      user={user}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
