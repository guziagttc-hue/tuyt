import React from 'react';
import type { User } from '../types';

interface RightSidebarProps {
    allUsers: User[];
    loggedInUser: User;
    onSelectUser: (user: User) => void;
    onToggleObserve: (user: User) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ allUsers, loggedInUser, onSelectUser, onToggleObserve }) => {
    const suggestedUsers = allUsers.filter(u => u.username !== loggedInUser.username);

    return (
        <div className="text-white p-4 bg-[#181520] rounded-2xl h-full flex flex-col">
            <h3 className="text-lg font-bold mb-4 text-gray-300">Suggested for you</h3>
            <ul className="space-y-4 overflow-y-auto">
                {suggestedUsers.length > 0 ? (
                    suggestedUsers.map(user => {
                        const isObserving = loggedInUser.observing.includes(user.username);
                        return (
                            <li key={user.username} className="flex items-center justify-between">
                                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onSelectUser(user)}>
                                    <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-sm text-gray-200 group-hover:text-white">{user.name}</p>
                                        <p className="text-xs text-gray-500 group-hover:text-gray-400">{user.username}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onToggleObserve(user)}
                                    className={`font-bold text-sm transition-colors ${isObserving ? 'text-gray-400 hover:text-gray-300' : 'text-cyan-400 hover:text-cyan-300'}`}
                                >
                                    {isObserving ? 'Observing' : 'Observe'}
                                </button>
                            </li>
                        );
                    })
                ) : (
                    <p className="text-sm text-gray-500">No suggestions at the moment.</p>
                )}
            </ul>
        </div>
    );
};

export default RightSidebar;