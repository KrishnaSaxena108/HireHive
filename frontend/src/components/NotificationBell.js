import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react/index.js';
import { Bell, Check } from 'lucide-react';

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
      <button onClick={() => setOpen(!open)} className="relative focus:outline-none">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50">
          {loading && <p className="p-2 text-center text-sm">Loading...</p>}
          {error && <p className="p-2 text-sm text-red-500">Error</p>}
          {data && data.notifications.length === 0 && (
            <p className="p-2 text-sm text-gray-500">No notifications</p>
          )}
          {data && data.notifications.map(n => (
            <div key={n.id} className="px-4 py-2 border-b last:border-0 flex justify-between items-center">
              <span className={`${n.isRead ? 'text-gray-400' : 'text-gray-800'} text-sm`}>{n.message}</span>
              {!n.isRead && (
                <button onClick={() => handleMark(n.id)} className="text-green-500">
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
