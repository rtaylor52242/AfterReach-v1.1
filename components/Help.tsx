
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  ListTodo, 
  Calendar, 
  FileText, 
  MessageCircleHeart, 
  Settings,
  Plus,
  Trash2,
  Edit2,
  Mic,
  Volume2,
  Search
} from 'lucide-react';

export const Help: React.FC = () => {
  const sections = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="text-ar-taupe" size={24} />,
      content: (
        <ul className="list-disc pl-5 space-y-2 text-ar-accent dark:text-ar-dark-accent">
          <li>View an overview of your progress with the Legal Checklist pie chart. Hover over the chart for details.</li>
          <li>See quick statistics on connected providers and upcoming events.</li>
          <li>Access the top 3 recommended next steps to stay on track.</li>
        </ul>
      )
    },
    {
      title: 'Find Providers',
      icon: <Users className="text-ar-taupe" size={24} />,
      content: (
        <ul className="list-disc pl-5 space-y-2 text-ar-accent dark:text-ar-dark-accent">
          <li><strong>Search:</strong> Use the search bar to find professionals by name, business, or location.</li>
          <li><strong>Filter:</strong> Use the dropdown to filter by roles (e.g., Funeral Director, Attorney).</li>
          <li><strong>Manage:</strong> Click <Plus size={16} className="inline" /> to add a new provider. Click the card to view details, edit, or delete.</li>
          <li><strong>Roles:</strong> Click the Gear icon next to the filter to add, edit, or delete professional roles.</li>
          <li><strong>Reviews:</strong> Open a provider's profile to read or write reviews and see their rating.</li>
        </ul>
      )
    },
    {
      title: 'Legal Checklist',
      icon: <CheckSquare className="text-ar-taupe" size={24} />,
      content: (
        <ul className="list-disc pl-5 space-y-2 text-ar-accent dark:text-ar-dark-accent">
          <li>Track essential tasks for estate administration.</li>
          <li>Click the circle icon next to a task to mark it as complete.</li>
          <li>Click <strong>"Add Item"</strong> to create your own custom checklist tasks.</li>
          <li>Use the calendar icon on a task to see its due date.</li>
        </ul>
      )
    },
    {
      title: 'Family Tasks',
      icon: <ListTodo className="text-ar-taupe" size={24} />,
      content: (
        <ul className="list-disc pl-5 space-y-2 text-ar-accent dark:text-ar-dark-accent">
          <li>Manage daily logistics for family, pets, and household needs.</li>
          <li><strong>Add:</strong> Fill out the form at the top and click "Add Task".</li>
          <li><strong>Edit:</strong> Click the <Edit2 size={16} className="inline" /> pencil icon to modify a task.</li>
          <li><strong>Delete:</strong> Click the <Trash2 size={16} className="inline" /> trash icon to remove a task (requires confirmation).</li>
          <li>Tasks are color-coded by category (Personal, Household, Pet, Admin).</li>
        </ul>
      )
    },
    {
      title: 'Calendar',
      icon: <Calendar className="text-ar-taupe" size={24} />,
      content: (
        <ul className="list-disc pl-5 space-y-2 text-ar-accent dark:text-ar-dark-accent">
          <li>View all your important dates and deadlines in one place.</li>
          <li><strong>Navigate:</strong> Use the arrow buttons to switch months.</li>
          <li><strong>Add Event:</strong> Double-click on any day to quickly add a new event.</li>
          <li><strong>Holidays:</strong> Look for red dots indicating major holidays. Click the dot to see the holiday name.</li>
          <li>Events are color-coded: Rose (Legal), Purple (Personal), Green (Household), Orange (Pet), Blue (Admin).</li>
        </ul>
      )
    },
    {
      title: 'Documents',
      icon: <FileText className="text-ar-taupe" size={24} />,
      content: (
        <ul className="list-disc pl-5 space-y-2 text-ar-accent dark:text-ar-dark-accent">
          <li>Securely store and organize important files.</li>
          <li><strong>Upload:</strong> Click "Upload Document" to add files (PDF, Images, etc.).</li>
          <li><strong>Filter:</strong> Click the summary cards at the top to filter by category (Essential, Financial, Personal).</li>
          <li><strong>Preview:</strong> Click the eye icon to preview a document.</li>
          <li><strong>Download/Delete:</strong> Use the action buttons in the list to manage your files.</li>
        </ul>
      )
    },
    {
      title: 'Ask Aura (AI)',
      icon: <MessageCircleHeart className="text-ar-taupe" size={24} />,
      content: (
        <ul className="list-disc pl-5 space-y-2 text-ar-accent dark:text-ar-dark-accent">
          <li>Chat with Aura for guidance, explanations, or emotional support.</li>
          <li><strong>Voice Input:</strong> Click the <Mic size={16} className="inline" /> microphone to speak your message.</li>
          <li><strong>Read Aloud:</strong> Toggle the <Volume2 size={16} className="inline" /> speaker icon to have Aura read responses to you.</li>
          <li><strong>Clear History:</strong> Click the trash icon in the header to reset the conversation.</li>
        </ul>
      )
    },
    {
      title: 'Settings',
      icon: <Settings className="text-ar-taupe" size={24} />,
      content: (
        <ul className="list-disc pl-5 space-y-2 text-ar-accent dark:text-ar-dark-accent">
          <li><strong>Profile:</strong> Update your name, email, and upload a profile photo.</li>
          <li><strong>Security:</strong> Change your password or enable Two-Factor Authentication (2FA).</li>
          <li><strong>Appearance:</strong> Toggle Dark Mode for a more comfortable viewing experience at night.</li>
          <li><strong>Notifications:</strong> Customize your email and push notification preferences.</li>
        </ul>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-ar-text dark:text-ar-dark-text">Help & Guide</h1>
        <p className="text-ar-accent dark:text-ar-dark-accent mt-1">Learn how to navigate and use the features of AfterReach.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-ar-dark-card rounded-xl border border-ar-beige dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                {section.icon}
              </div>
              <h2 className="text-lg font-bold text-ar-text dark:text-ar-dark-text">{section.title}</h2>
            </div>
            <div className="p-6">
              {section.content}
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-ar-taupe/10 rounded-xl p-6 text-center border border-ar-taupe/20">
        <h3 className="text-lg font-bold text-ar-text dark:text-ar-dark-text mb-2">Need more help?</h3>
        <p className="text-ar-accent dark:text-ar-dark-accent mb-4">
          Our support team is available to assist you with any technical issues or questions.
        </p>
        <a 
          href="mailto:support@afterreach.com" 
          className="inline-flex items-center justify-center px-6 py-2 bg-ar-taupe text-white rounded-lg hover:bg-opacity-90 font-medium"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};
