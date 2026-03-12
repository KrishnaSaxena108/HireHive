import React, { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react/index.js';
import { Bell, Check } from 'lucide-react';
import { socket } from '../socket';

const GET_NOTIFICATIONS = gql`
  query Notifications($userId: ID!) {
    notifications(userId: $userId) {
      id
      message
      isRead
      createdAt
    }
  }
`;

const MARK_READ = gql`
  mutation MarkRead($id: ID!) {
    markNotificationRead(id: $id) {
      id
      isRead
    }
  }
`;

const NotificationBell = () => {
  const userId = localStorage.getItem('userId');
  const { loading, error, data, refetch } = useQuery(GET_NOTIFICATIONS, {
    variables: { userId },
    skip: !userId
  });

  useEffect(() => {
    if (userId) {
      socket.emit('register_private_room', userId);
      
      const handleNotification = () => {
        refetch();
      };
      
      socket.on('notification', handleNotification);

      return () => {
        socket.off('notification', handleNotification);
      };
    }
  }, [userId, refetch]);

  const [markRead] = useMutation(MARK_READ, {
    onCompleted: () => refetch()
  });

  const [open, setOpen] = useState(false);

  const unreadCount = data ? data.notifications.filter(n => !n.isRead).length : 0;

  const handleMark = (id) => {
    markRead({ variables: { id } });
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative focus:outline-none p-1 rounded-lg hover:bg-teal-50 transition-colors">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 text-xs bg-rose-500 text-white rounded-full min-w-5 h-5 px-1 flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-lg shadow-xl rounded-xl border border-slate-200 z-50 overflow-hidden">
          {loading && <p className="p-2 text-center text-sm">Loading...</p>}
          {error && <p className="p-2 text-sm text-red-500">Error</p>}
          {data && data.notifications.length === 0 && (
            <p className="p-4 text-sm text-slate-500">No notifications</p>
          )}
          {data && data.notifications.map(n => (
            <div key={n.id} className="px-4 py-3 border-b border-slate-100 last:border-0 flex justify-between items-center gap-3 hover:bg-slate-50 transition-colors">
              <span className={`${n.isRead ? 'text-slate-400' : 'text-slate-800'} text-sm leading-snug`}>{n.message}</span>
              {!n.isRead && (
                <button onClick={() => handleMark(n.id)} className="text-teal-600 hover:text-teal-700">
                  <Check size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
