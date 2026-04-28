import React, { useState } from 'react';
import { Search, Send, ChevronLeft, MoreVertical, MapPin, Calendar, Camera, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_USERS } from '../constants/mockData';
import { cn } from '../lib/utils';

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  const chats = [
    { id: '1', user: MOCK_USERS[0], lastMessage: 'Is the camera available this Saturday?', time: '2m', unread: 1 },
    { id: '2', user: MOCK_USERS[1], lastMessage: 'Great, see you at the Starbucks!', time: '1h', unread: 0 },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex h-[calc(100vh-10rem)]">
      {/* Sidebar */}
      <aside className={cn(
        "w-full md:w-80 border-r border-gray-100 flex flex-col transition-all",
        selectedChat ? "hidden md:flex" : "flex"
      )}>
        <div className="p-6 border-b border-gray-100 space-y-4">
          <h1 className="text-xl font-bold">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-sm border-transparent focus:bg-white focus:border-brand-accent/20 transition-all font-medium"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={cn(
                "w-full p-4 flex gap-4 transition-all hover:bg-gray-50 text-left relative",
                selectedChat === chat.id && "bg-brand-accent/5 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-1 after:bg-brand-accent"
              )}
            >
              <img src={chat.user.avatar} alt={chat.user.name} className="w-12 h-12 rounded-2xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-brand-primary truncate">{chat.user.name}</h3>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">{chat.time}</span>
                </div>
                <p className={cn("text-xs truncate", chat.unread > 0 ? "text-brand-primary font-bold" : "text-gray-400")}>
                  {chat.lastMessage}
                </p>
              </div>
              {chat.unread > 0 && (
                <div className="absolute right-4 bottom-4 w-2 h-2 bg-brand-accent rounded-full" />
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Message Content */}
      <main className={cn(
        "flex-1 flex flex-col bg-gray-50/30 transition-all",
        !selectedChat ? "hidden md:flex" : "flex"
      )}>
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="bg-white p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden p-2 text-gray-400 hover:text-brand-primary"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="relative">
                  <img src={chats.find(c => c.id === selectedChat)?.user.avatar} className="w-10 h-10 rounded-xl object-cover" alt="" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-trust-green border-2 border-white rounded-full" />
                </div>
                <div>
                  <h2 className="font-bold text-brand-primary">{chats.find(c => c.id === selectedChat)?.user.name}</h2>
                  <span className="text-[10px] font-bold text-trust-green uppercase tracking-wider">Online</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-brand-primary"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Item Context */}
              <div className="flex justify-center">
                <div className="bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 max-w-sm">
                  <Camera className="w-8 h-8 text-gray-300" />
                  <div className="flex-1 text-left">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Regarding your gear</p>
                    <p className="text-xs font-bold text-brand-primary">Sony A7IV Mirrorless Camera</p>
                  </div>
                  <button className="text-brand-accent text-xs font-bold uppercase">View</button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm max-w-[80%]">
                    <p className="text-sm text-gray-700">Hey! Is the camera available this Saturday?</p>
                    <span className="text-[9px] text-gray-300 font-bold uppercase mt-2 block">10:42 AM</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-brand-primary p-4 rounded-2xl rounded-tr-none text-white shadow-md max-w-[80%]">
                    <p className="text-sm">Yes, it is! Are you looking for the morning or afternoon pickup?</p>
                    <span className="text-[9px] text-white/50 font-bold uppercase mt-2 block">10:45 AM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-gray-100">
              <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-2 pl-4 border border-transparent focus-within:border-brand-accent/20 transition-all">
                <input 
                  type="text" 
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                />
                <button className="p-2 bg-brand-primary text-white rounded-xl shadow-lg shadow-brand-primary/10 hover:bg-opacity-90 transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
              <MessageCircle className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-brand-primary">Select a conversation</h2>
              <p className="text-sm text-gray-500 max-w-xs">Coordinate pickups, ask technical questions, and build trust with your neighbors.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
