
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
import { ViewId, LegalTask } from './types';
import { INITIAL_LEGAL_TASKS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewId>('dashboard');
  const [legalTasks, setLegalTasks] = useState<LegalTask[]>(INITIAL_LEGAL_TASKS);
  const [darkMode, setDarkMode] = useState<boolean>(false);

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

  const handleToggleLegalTask = (id: string) => {
    setLegalTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddLegalTask = (task: LegalTask) => {
    setLegalTasks(prev => [task, ...prev]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard legalTasks={legalTasks} onNavigate={setActiveTab} />;
      case 'directory':
        return <Directory />;
      case 'checklist':
        return <Checklist tasks={legalTasks} onToggleTask={handleToggleLegalTask} onAddTask={handleAddLegalTask} />;
      case 'tasks':
        return <Tasks />;
      case 'calendar':
        return <Calendar />;
      case 'documents':
        return <Documents />;
      case 'ai-chat':
        return <AIChat />;
      case 'settings':
        return <Settings darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      default:
        return <Dashboard legalTasks={legalTasks} onNavigate={setActiveTab} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onNavigate={setActiveTab} 
      darkMode={darkMode} 
      toggleDarkMode={toggleDarkMode}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
