import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { Send, Sparkles, User, Bot, Mic, MicOff, Volume2, VolumeX, Trash2, AlertTriangle } from 'lucide-react';

const INITIAL_MESSAGE_TEXT = 'Hello. I am Aura. I am here to help you organize tasks, explain complex terms, or simply listen if you feel overwhelmed. How can I support you right now?';

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'welcome',
    role: 'model',
    text: INITIAL_MESSAGE_TEXT,
    timestamp: Date.now()
  }]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  
  // Text to Speech State - Default to TRUE
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const ttsEnabledRef = useRef(true); // Ref to access latest state in async callbacks

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Cleanup speech synthesis on unmount
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            
            if (finalTranscript || interimTranscript) {
                 setInputValue(prev => {
                    return (finalTranscript || interimTranscript);
                 });
            }
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };
        
        recognitionRef.current.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
        alert("Speech recognition is not supported in this browser.");
        return;
    }

    if (isListening) {
        recognitionRef.current.stop();
    } else {
        recognitionRef.current.start();
        setIsListening(true);
    }
  };

  const toggleTTS = () => {
    const newValue = !isTTSEnabled;
    setIsTTSEnabled(newValue);
    ttsEnabledRef.current = newValue;
    
    if (!newValue) {
        window.speechSynthesis.cancel();
    }
  };

  const handleClearChat = () => {
    setIsClearModalOpen(true);
  };

  const confirmClear = () => {
    window.speechSynthesis.cancel();
    setMessages([{
        id: `welcome-${Date.now()}`, // Ensure unique ID to force re-render
        role: 'model',
        text: INITIAL_MESSAGE_TEXT,
        timestamp: Date.now()
    }]);
    setIsClearModalOpen(false);
  };

  const speakResponse = (text: string) => {
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    // Optional: Customizing voice properties could be added here
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const responseText = await sendMessageToGemini(userMsg.text);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);

    // Check ref for latest preference since we are in an async callback
    if (ttsEnabledRef.current) {
        speakResponse(responseText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderClearModal = () => {
    if (!isClearModalOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-ar-dark-card rounded-2xl p-6 max-w-sm w-full shadow-xl border border-ar-beige dark:border-gray-700">
                <div className="flex items-center gap-3 text-red-500 mb-4">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                      <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-ar-text dark:text-ar-dark-text">Clear History?</h3>
                </div>
                <p className="text-ar-accent dark:text-ar-dark-accent mb-6">
                    Are you sure you want to clear the conversation history? This cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button 
                      onClick={() => setIsClearModalOpen(false)}
                      className="flex-1 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-ar-text dark:text-ar-dark-text hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
                    >
                        Cancel
                    </button>
                    <button 
                      onClick={confirmClear}
                      className="flex-1 py-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium shadow-md"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white dark:bg-ar-dark-card rounded-2xl shadow-lg border border-ar-beige dark:border-gray-700 overflow-hidden relative">
      {renderClearModal()}
      
      {/* Header */}
      <div className="bg-ar-taupe p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
                <Sparkles className="text-white" size={24} />
            </div>
            <div>
                <h2 className="text-white font-bold text-lg">Aura</h2>
                <p className="text-white/80 text-xs">AI Support Guide</p>
            </div>
        </div>
        
        <div className="flex gap-2">
            <button 
                type="button"
                onClick={handleClearChat}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                title="Clear Chat History"
            >
                <Trash2 size={20} />
            </button>
            <button 
                type="button"
                onClick={toggleTTS}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                title={isTTSEnabled ? "Turn Off Read Aloud" : "Turn On Read Aloud"}
            >
                {isTTSEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-ar-bg dark:bg-gray-900/50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div 
              className={`
                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm
                ${msg.role === 'user' ? 'bg-ar-taupe text-white' : 'bg-ar-sage text-white'}
              `}
            >
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            
            <div 
              className={`
                max-w-[80%] p-4 text-sm md:text-base leading-relaxed whitespace-pre-wrap shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-ar-taupe text-white rounded-2xl rounded-tr-none' 
                  : 'bg-white dark:bg-gray-800 text-ar-text dark:text-gray-100 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700'}
              `}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-ar-sage text-white flex items-center justify-center">
                <Bot size={20} />
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 flex items-center gap-2">
               <div className="w-2 h-2 bg-ar-accent rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-ar-accent rounded-full animate-bounce delay-75"></div>
               <div className="w-2 h-2 bg-ar-accent rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-ar-dark-card border-t border-ar-beige dark:border-gray-700">
        <div className="relative flex items-center gap-3">
          <button
            type="button"
            onClick={toggleListening}
            className={`
                p-3 rounded-xl transition-all duration-200 flex items-center justify-center
                ${isListening 
                    ? 'bg-red-500 text-white animate-pulse shadow-red-200' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}
            `}
            title={isListening ? "Stop Listening" : "Use Microphone"}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <textarea 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Type a message..."}
            rows={1}
            className="flex-1 resize-none bg-gray-50 dark:bg-gray-800 text-black dark:text-white p-4 pr-12 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-ar-taupe"
            style={{ color: 'inherit' }} 
          />
          <button 
            type="button"
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-2 p-2 bg-ar-taupe text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 transition"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-xs text-ar-accent mt-3">
            Aura is an AI assistant and does not provide medical or legal advice.
        </p>
      </div>
    </div>
  );
};