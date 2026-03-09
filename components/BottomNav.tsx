
import React from 'react';
import type { View } from '../App';
import { HomeIcon, ShopIcon, InboxIcon, ProfileIcon } from '../constants';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false }) => (
  <div className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-white' : 'text-gray-500 hover:text-white'}`}>
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </div>
);

interface BottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onUploadClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, onUploadClick }) => {
  const iconClasses = "w-6 h-6";

  return (
    <nav className="bg-black px-4 py-2 border-t border-white/10 w-full shrink-0">
      <div className="flex justify-around items-center">
        <button onClick={() => onNavigate('feed')} className="flex-1">
          <NavItem
            label="Home"
            icon={<HomeIcon className={iconClasses} active={currentView === 'feed'} />}
            active={currentView === 'feed'}
          />
        </button>
        <button onClick={() => onNavigate('foryou')} className="flex-1">
          <NavItem
            label="Shop"
            icon={<ShopIcon className={iconClasses} active={currentView === 'foryou'} />}
            active={currentView === 'foryou'}
          />
        </button>
        <button 
          onClick={onUploadClick}
          className="w-14 h-10 flex items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 shadow-lg shadow-purple-600/50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
        <button onClick={() => onNavigate('inbox')} className="flex-1">
          <NavItem
            label="Inbox"
            icon={<InboxIcon className={iconClasses} active={currentView === 'inbox'} />}
            active={currentView === 'inbox'}
          />
        </button>
        <button onClick={() => onNavigate('profile')} className="flex-1">
          <NavItem
            label="Profile"
            icon={<ProfileIcon className={iconClasses} active={currentView === 'profile'} />}
            active={currentView === 'profile'}
          />
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
