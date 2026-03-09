import React, { useState, useRef, useEffect } from 'react';
import { conversationsData, notificationsData, InboxIcon, NotificationIcon, LikeIcon, CommentIcon, ProfileIcon } from '../constants';
import type { Conversation, User, Notification } from '../types';

interface InboxPageProps {
  onSelectUser: (user: User) => void;
}

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'like': return <LikeIcon />;
      case 'comment': return <CommentIcon />;
      case 'follow': return <ProfileIcon className="w-5 h-5 text-purple-400" active />;
      default: return null;
    }
  };

  const getText = () => {
    switch (notification.type) {
      case 'like': return <>liked your post.</>;
      case 'comment': return <>commented on your post.</>;
      case 'follow': return <>started following you.</>;
      default: return null;
    }
  };

  return (
    <div className={`flex items-start gap-3 p-3 hover:bg-gray-700/50 transition-colors cursor-pointer ${!notification.read ? 'bg-purple-600/10' : ''}`}>
      <div className="relative">
        <img src={notification.user.avatar} alt={notification.user.name} className="w-10 h-10 rounded-full" />
        <div className="absolute -bottom-1 -right-1 bg-[#282A36] rounded-full p-0.5">{getIcon()}</div>
      </div>
      <div className="flex-grow text-sm">
        <p>
          <span className="font-bold">{notification.user.name}</span>{' '}
          {getText()}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{notification.timestamp}</p>
      </div>
      {notification.post ? (
        <img src={notification.post.thumbnail} alt="post thumbnail" className="w-10 h-10 rounded-md object-cover" />
      ) : <div className="w-10 h-10 shrink-0" />}
    </div>
  );
};


const NotificationsDropdown = () => (
    <div className="absolute top-14 right-0 w-80 md:w-96 bg-[#1f1b2d] border border-gray-700/50 rounded-lg shadow-2xl z-50 overflow-hidden">
        <div className="p-3 border-b border-gray-700/50">
            <h3 className="font-bold text-lg">Notifications</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
            {notificationsData.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
            ))}
        </div>
        <div className="p-2 text-center border-t border-gray-700/50 bg-[#1f1b2d]/80 backdrop-blur-sm">
            <button className="text-sm font-semibold text-cyan-400 hover:underline">
                View all notifications
            </button>
        </div>
    </div>
);


const InboxPage: React.FC<InboxPageProps> = ({ onSelectUser }) => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversationsData[0] || null);
  const [mobileChatVisible, setMobileChatVisible] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const unreadCount = notificationsData.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMobileChatVisible(true);
  }

  const ConversationList = () => (
    <div className="w-full md:w-1/3 lg:w-[320px] shrink-0 border-r border-gray-700/50 flex flex-col h-full bg-[#181520] md:bg-transparent">
      <header className="p-4 border-b border-gray-700/50 shrink-0 flex justify-between items-center">
        <h1 className="text-xl font-bold">Inbox</h1>
        <div className="relative" ref={notificationsRef}>
            <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative text-gray-400 hover:text-white transition-colors">
                <NotificationIcon />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-[#181520]">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isNotificationsOpen && <NotificationsDropdown />}
        </div>
      </header>
      <div className="flex-grow overflow-y-auto">
        {conversationsData.map(convo => (
          <button 
            key={convo.id} 
            onClick={() => handleSelectConversation(convo)}
            className={`w-full text-left p-4 flex items-start gap-4 hover:bg-gray-700/30 transition-colors ${selectedConversation?.id === convo.id && !mobileChatVisible ? 'bg-gray-700/50' : ''}`}
          >
            <img src={convo.user.avatar} alt={convo.user.name} className="w-12 h-12 rounded-full" />
            <div className="flex-grow overflow-hidden">
              <div className="flex justify-between items-center">
                <p className="font-bold truncate">{convo.user.name}</p>
                <p className="text-xs text-gray-400 shrink-0">{convo.timestamp}</p>
              </div>
              <div className="flex justify-between items-start mt-1">
                <p className="text-sm text-gray-400 truncate">{convo.lastMessage}</p>
                {convo.unread > 0 && (
                  <span className="bg-cyan-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">{convo.unread}</span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const ChatView = () => (
    <div className="flex-grow flex flex-col h-full bg-[#0D0F13]">
      {selectedConversation ? (
        <>
          <header className="p-4 border-b border-gray-700/50 flex items-center gap-3 shrink-0">
            {/* Back button for mobile */}
            <button onClick={() => setMobileChatVisible(false)} className="md:hidden text-white mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <img src={selectedConversation.user.avatar} alt={selectedConversation.user.name} className="w-10 h-10 rounded-full cursor-pointer" onClick={() => onSelectUser(selectedConversation.user)} />
            <div>
                <p className="font-bold cursor-pointer hover:underline" onClick={() => onSelectUser(selectedConversation.user)}>{selectedConversation.user.name}</p>
                <p className="text-xs text-gray-400">{selectedConversation.user.username}</p>
            </div>
          </header>
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {selectedConversation.messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${msg.sender === 'me' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-[#282A36] rounded-bl-none'}`}>
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-purple-200' : 'text-gray-400'} text-right`}>{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
          <footer className="p-4 border-t border-gray-700/50 shrink-0">
            <div className="bg-[#282A36] rounded-lg flex items-center px-4">
                <input type="text" placeholder="Type a message..." className="w-full bg-transparent p-3 outline-none" />
                <button className="text-cyan-400 font-bold p-2 hover:text-cyan-300 transition-colors">Send</button>
            </div>
          </footer>
        </>
      ) : (
        <div className="w-full h-full hidden md:flex items-center justify-center text-gray-500">
          <div className="text-center">
            <InboxIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h2 className="text-xl font-semibold">Your Messages</h2>
            <p>Select a conversation to start chatting.</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full h-full flex overflow-hidden">
        {/* Mobile View Logic */}
        <div className={`w-full h-full md:hidden ${mobileChatVisible ? 'hidden' : 'block'}`}>
            <ConversationList />
        </div>
        <div className={`w-full h-full md:hidden ${mobileChatVisible ? 'block' : 'hidden'}`}>
            <ChatView />
        </div>

        {/* Desktop View Logic */}
        <div className="hidden md:flex w-full h-full">
            <ConversationList />
            <ChatView />
        </div>
    </div>
  );
};

export default InboxPage;
