import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react/index.js';
import { MessageSquare, Send, User } from 'lucide-react';

const GET_USER_MESSAGES = gql`
  query GetUserMessages {
    userMessages {
      id
      content
      senderId
      receiverId
      jobId
      createdAt
      sender {
        username
      }
      receiver {
        username
      }
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($receiverId: ID!, $content: String!, $jobId: ID) {
    sendMessage(receiverId: $receiverId, content: $content, jobId: $jobId) {
      id
      content
    }
  }
`;

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const { loading, error, data, refetch } = useQuery(GET_USER_MESSAGES);

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      setNewMessage('');
      refetch();
    }
  });

  if (loading) return <div className="p-10 text-center">Loading messages...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error: {error.message}</div>;

  const messages = data?.userMessages || [];
  const userId = localStorage.getItem('userId');

  // Group messages by conversation (other user)
  const conversations = {};
  messages.forEach(msg => {
    const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
    const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
    if (!conversations[otherUserId]) {
      conversations[otherUserId] = {
        user: otherUser,
        messages: []
      };
    }
    conversations[otherUserId].messages.push(msg);
  });

  const conversationList = Object.values(conversations);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    sendMessage({
      variables: {
        receiverId: selectedConversation.user.id,
        content: newMessage.trim()
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-black text-slate-900 mb-8">Messages</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4">Conversations</h2>
          {conversationList.length === 0 ? (
            <p className="text-slate-500">No messages yet</p>
          ) : (
            <div className="space-y-2">
              {conversationList.map((conv) => (
                <div
                  key={conv.user.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-4 rounded-xl cursor-pointer transition ${
                    selectedConversation?.user.id === conv.user.id
                      ? 'bg-indigo-100 border border-indigo-300'
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{conv.user.username}</p>
                      <p className="text-sm text-slate-500">
                        {conv.messages.length} message{conv.messages.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6">
          {selectedConversation ? (
            <>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User size={24} className="text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold">{selectedConversation.user.username}</h2>
              </div>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {selectedConversation.messages
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl ${
                        msg.senderId === userId
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.senderId === userId ? 'text-indigo-200' : 'text-slate-500'}`}>
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <MessageSquare size={48} className="text-slate-300 mb-4" />
              <p className="text-slate-500">Select a conversation to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;