import React, { useState, useRef } from 'react';
import { Upload, Search, FileText, MessageCircle, X, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { FileUploader } from './FileUploader';
import { CustomerSearch } from './CustomerSearch';
import { CSVExtractor } from './CSVExtractor';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './ui/resizable';

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
  const [searchExpanded, setSearchExpanded] = useState(true);
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">File Processing Studio</h1>
              <p className="text-sm text-slate-500">Upload, extract, and search your data with AI assistance</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Search className="w-4 h-4" />
              <span className="font-medium">Search Data</span>
            </button>
            <button
              onClick={() => setShowUploader(!showUploader)}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Upload className="w-4 h-4" />
              <span className="font-medium">Upload File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area with Resizable Panels */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* File Uploader Panel */}
          {showUploader && (
            <>
              <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                <div className="h-full bg-white/90 backdrop-blur-sm border-r border-blue-100 shadow-lg">
                  <div className="p-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Upload className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800">File Upload</h3>
                      </div>
                      <button
                        onClick={() => setShowUploader(false)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-slate-500" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 overflow-y-auto h-full">
                    <FileUploader onFileProcessed={handleFileProcessed} />
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          {/* Search Panel with Resizable functionality */}
          {showSearch && (
            <>
              <ResizablePanel defaultSize={30} minSize={25} maxSize={50}>
                <div className="h-full bg-white/90 backdrop-blur-sm border-r border-blue-100 shadow-lg flex flex-col">
                  <div className="p-6 border-b border-blue-100 bg-gradient-to-r from-emerald-50 to-green-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                          <Search className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800">Data Search</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSearchExpanded(!searchExpanded)}
                          className="p-2 hover:bg-emerald-100 rounded-lg transition-colors flex items-center space-x-1"
                          title={searchExpanded ? "Collapse search" : "Expand search"}
                        >
                          <Filter className="w-4 h-4 text-emerald-600" />
                          {searchExpanded ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4 text-emerald-600" />}
                        </button>
                        <button
                          onClick={() => setShowSearch(false)}
                          className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5 text-slate-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expandable Search Content */}
                  <div className={`flex-1 overflow-hidden transition-all duration-300 ${searchExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    {searchExpanded && (
                      <div className="p-6 h-full overflow-y-auto">
                        <CustomerSearch data={csvData} />
                      </div>
                    )}
                  </div>
                  
                  {/* Collapsed State */}
                  {!searchExpanded && (
                    <div className="p-6 text-center">
                      <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm">Search panel collapsed</p>
                      <p className="text-xs text-slate-400">Click expand to access search features</p>
                    </div>
                  )}
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          {/* Main Chat Area */}
          <ResizablePanel defaultSize={showUploader || showSearch ? 50 : 100}>
            <div className="flex flex-col h-full">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl mx-auto w-full">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-2xl px-6 py-4 rounded-2xl shadow-md ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                          : 'bg-white text-slate-800 border border-slate-200'
                      }`}
                    >
                      <p className="text-sm leading-relaxed break-words">{message.content}</p>
                      {message.fileData && (
                        <div className="mt-4 pt-4 border-t border-slate-300/50">
                          <CSVExtractor data={message.fileData} />
                        </div>
                      )}
                      <p className={`text-xs mt-3 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-slate-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Modern Input Area */}
              <div className="bg-white/80 backdrop-blur-sm border-t border-blue-100 p-6">
                <div className="max-w-4xl mx-auto">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message here..."
                      className="flex-1 px-5 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
