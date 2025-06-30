
import React, { useState, useRef } from 'react';
import { Upload, Search, FileText, MessageCircle, X } from 'lucide-react';
import { FileUploader } from './FileUploader';
import { CustomerSearch } from './CustomerSearch';
import { CSVExtractor } from './CSVExtractor';

interface Message {
  id: string;
  type: 'user' | 'system';
  content: string;
  timestamp: Date;
  fileData?: any[];
}

export const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome! Upload an Excel or CSV file to get started, or search through your existing data.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [csvData, setCsvData] = useState<any[]>([]);
  const [showUploader, setShowUploader] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (content: string, type: 'user' | 'system', fileData?: any[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      fileData
    };
    setMessages(prev => [...prev, newMessage]);
    setTimeout(scrollToBottom, 100);
  };

  const handleFileProcessed = (data: any[], filename: string) => {
    setCsvData(prev => [...prev, ...data]);
    addMessage(`✅ Successfully processed "${filename}" with ${data.length} records`, 'system', data);
    setShowUploader(false);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addMessage(inputValue, 'user');
      setInputValue('');
      
      // Simple response simulation
      setTimeout(() => {
        addMessage('Message received! Use the file upload or search features to process your data.', 'system');
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">File Processing Chat</h1>
              <p className="text-sm text-slate-500">Upload, extract, and search your data</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
            <button
              onClick={() => setShowUploader(!showUploader)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
          </div>
        </div>
      </div>

      {/* Side Panels */}
      <div className="flex flex-1 overflow-hidden">
        {/* File Uploader Panel */}
        {showUploader && (
          <div className="w-80 bg-white border-r border-slate-200 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">File Upload</h3>
              <button
                onClick={() => setShowUploader(false)}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <FileUploader onFileProcessed={handleFileProcessed} />
          </div>
        )}

        {/* Search Panel */}
        {showSearch && (
          <div className="w-80 bg-white border-r border-slate-200 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Customer Search</h3>
              <button
                onClick={() => setShowSearch(false)}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <CustomerSearch data={csvData} />
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-800 border border-slate-200'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.fileData && (
                    <div className="mt-2 pt-2 border-t border-slate-300">
                      <CSVExtractor data={message.fileData} />
                    </div>
                  )}
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-slate-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-slate-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
