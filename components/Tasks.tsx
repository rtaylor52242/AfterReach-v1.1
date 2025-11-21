import React, { useState } from 'react';
import { PersonalTask, PersonalTaskCategory } from '../types';
import { Trash2, Calendar, User, ListTodo, Pencil, X, Check, AlertTriangle, Save, Plus } from 'lucide-react';

export const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<PersonalTask[]>([
    { id: '1', title: 'Order flowers for service', assignee: 'Sarah', category: 'Personal', completed: false, date: '2023-11-10' },
    { id: '2', title: 'Clean guest room', assignee: 'Mark', category: 'Household', completed: true, date: '2023-11-08' },
    { id: '3', title: 'Find pet sitter for Buster', assignee: 'Alex', category: 'Pet', completed: false, date: '2023-11-12' },
  ]);

  const [newTask, setNewTask] = useState<Partial<PersonalTask>>({
    title: '',
    assignee: '',
    category: 'Personal',
    date: ''
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const handleSaveTask = () => {
    if (!newTask.title) return;

    if (editId) {
      // Update existing task
      setTasks(tasks.map(t => 
        t.id === editId 
          ? { 
              ...t, 
              title: newTask.title!, 
              assignee: newTask.assignee || 'Unassigned',
              category: (newTask.category as PersonalTaskCategory) || 'Personal',
              date: newTask.date || ''
            } 
          : t
      ));
      setEditId(null);
    } else {
      // Add new task
      const task: PersonalTask = {
        id: Date.now().toString(),
        title: newTask.title,
        assignee: newTask.assignee || 'Unassigned',
        category: (newTask.category as PersonalTaskCategory) || 'Personal',
        completed: false,
        date: newTask.date || new Date().toISOString().split('T')[0],
      };
      setTasks([task, ...tasks]);
    }
    
    // Reset form
    setNewTask({ title: '', assignee: '', category: 'Personal', date: '' });
  };

  const startEdit = (task: PersonalTask) => {
    setNewTask({
      title: task.title,
      assignee: task.assignee,
      category: task.category,
      date: task.date
    });
    setEditId(task.id);
    // Scroll to top to see the edit form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setNewTask({ title: '', assignee: '', category: 'Personal', date: '' });
    setEditId(null);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      setTasks(tasks.filter(t => t.id !== taskToDelete));
      setTaskToDelete(null);
      // If we deleted the task currently being edited, cancel edit mode
      if (editId === taskToDelete) {
        cancelEdit();
      }
    }
  };

  const getCategoryColor = (cat: PersonalTaskCategory) => {
    switch (cat) {
        case 'Personal': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
        case 'Household': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
        case 'Pet': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
        case 'Admin': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
        default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderDeleteModal = () => {
    if (!taskToDelete) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-ar-dark-card rounded-2xl p-6 max-w-sm w-full shadow-xl border border-ar-beige dark:border-gray-700">
                <div className="flex items-center gap-3 text-red-500 mb-4">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                      <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-ar-text dark:text-ar-dark-text">Delete Task?</h3>
                </div>
                <p className="text-ar-accent dark:text-ar-dark-accent mb-6">
                    Are you sure you want to remove this task? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button 
                      onClick={() => setTaskToDelete(null)}
                      className="flex-1 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-ar-text dark:text-ar-dark-text hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
                    >
                        Cancel
                    </button>
                    <button 
                      onClick={confirmDelete}
                      className="flex-1 py-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium shadow-md"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-6 relative">
       {renderDeleteModal()}
       
       <div>
          <h1 className="text-3xl font-bold text-ar-text dark:text-ar-dark-text">Family Logistics</h1>
          <p className="text-ar-accent dark:text-ar-dark-accent mt-1">Coordinate daily tasks with family members.</p>
        </div>

      {/* Input/Edit Area */}
      <div className={`
        p-6 rounded-xl shadow-sm border transition-colors duration-300
        ${editId 
          ? 'bg-ar-taupe/5 dark:bg-ar-taupe/10 border-ar-taupe dark:border-ar-taupe' 
          : 'bg-white dark:bg-ar-dark-card border-ar-beige dark:border-gray-700'}
      `}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ar-accent">
            {editId ? 'Editing Task' : 'Add New Task'}
          </h2>
          {editId && (
            <button onClick={cancelEdit} className="text-xs text-ar-accent hover:text-ar-text flex items-center gap-1">
              <X size={14} /> Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4">
            <label className="block text-xs font-medium text-ar-accent mb-1">Task Description</label>
            <input 
              type="text" 
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSaveTask()}
              placeholder="e.g., Pick up relatives from airport"
              className="w-full p-3 bg-ar-bg dark:bg-gray-700 rounded-lg border-none focus:ring-2 focus:ring-ar-taupe dark:text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-ar-accent mb-1">Category</label>
            <select 
               value={newTask.category}
               onChange={e => setNewTask({ ...newTask, category: e.target.value as PersonalTaskCategory })}
               onKeyDown={e => e.key === 'Enter' && handleSaveTask()}
               className="w-full p-3 bg-ar-bg dark:bg-gray-700 rounded-lg border-none focus:ring-2 focus:ring-ar-taupe dark:text-white"
            >
                <option value="Personal">Personal</option>
                <option value="Household">Household</option>
                <option value="Pet">Pet</option>
                <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-ar-accent mb-1">Assignee</label>
            <input 
              type="text" 
              value={newTask.assignee}
              onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSaveTask()}
              placeholder="Name"
              className="w-full p-3 bg-ar-bg dark:bg-gray-700 rounded-lg border-none focus:ring-2 focus:ring-ar-taupe dark:text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-ar-accent mb-1">Due Date</label>
            <input 
              type="date" 
              value={newTask.date}
              onChange={e => setNewTask({ ...newTask, date: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSaveTask()}
              className="w-full p-3 bg-ar-bg dark:bg-gray-700 rounded-lg border-none focus:ring-2 focus:ring-ar-taupe dark:text-white"
            />
          </div>
          <div className="md:col-span-2">
            <button 
              onClick={handleSaveTask}
              className={`w-full p-3 text-white rounded-lg hover:bg-opacity-90 transition-colors flex justify-center items-center shadow-md font-medium ${editId ? 'bg-green-600 hover:bg-green-700' : 'bg-ar-taupe hover:bg-opacity-90'}`}
              title={editId ? "Save Changes" : "Add New Task"}
            >
              {editId ? (
                <>
                   <Save size={18} className="mr-2" /> Save
                </>
              ) : (
                "Add Task"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className={`
                flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border transition-all
                ${task.completed ? 'bg-gray-50 dark:bg-gray-800/30 border-transparent opacity-60' : 'bg-white dark:bg-ar-dark-card border-ar-beige dark:border-gray-700'}
                ${editId === task.id ? 'ring-2 ring-ar-taupe border-transparent' : ''}
            `}
          >
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={() => toggleTask(task.id)}
                    className={`
                        w-6 h-6 rounded border flex items-center justify-center transition-colors
                        ${task.completed 
                            ? 'bg-ar-taupe border-ar-taupe text-white' 
                            : 'border-gray-300 hover:border-ar-taupe text-transparent'}
                    `}
                >
                    <Check size={14} />
                </button>
                <div>
                    <h3 className={`font-medium text-lg ${task.completed ? 'line-through text-gray-400' : 'text-ar-text dark:text-ar-dark-text'}`}>{task.title}</h3>
                    <div className="flex gap-3 mt-1 text-sm text-ar-accent">
                        <span className="flex items-center gap-1"><User size={14} /> {task.assignee}</span>
                        {task.date && <span className="flex items-center gap-1"><Calendar size={14} /> {task.date}</span>}
                    </div>
                </div>
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto mt-2 md:mt-0">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(task.category)}`}>
                    {task.category}
                </span>
                <div className="flex gap-1">
                    <button 
                        onClick={() => startEdit(task)}
                        disabled={task.completed}
                        className="p-2 text-gray-400 hover:text-ar-taupe hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-30"
                        title="Edit"
                    >
                        <Pencil size={18} />
                    </button>
                    <button 
                        onClick={() => setTaskToDelete(task.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
             <div className="text-center py-12 text-ar-accent bg-white dark:bg-ar-dark-card rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                 <ListTodo className="mx-auto mb-3 opacity-50" size={48} />
                 <p>No family tasks yet. Add one above to get started.</p>
             </div>
        )}
      </div>
    </div>
  );
};