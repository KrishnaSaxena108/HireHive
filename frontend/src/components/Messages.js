import React, { useState, useRef, useEffect } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react/index.js';
import { Send, MessageSquare, Search, Circle } from 'lucide-react';

const GET_MESSAGES = gql`
  query GetMessages($otherUserId: ID!) {
    messages(otherUserId: $otherUserId) {
      id content createdAt
      sender { id username }
      receiver { id username }
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($receiverId: ID!, $content: String!) {
    sendMessage(receiverId: $receiverId, content: $content) {
      id content createdAt
      sender { id username }
    }
  }
`;

const DEMO_CONTACTS = [
  { id: '1', username: 'alex_dev', lastMsg: 'Sounds great, let me know!', time: '2m ago', online: true },
  { id: '2', username: 'sarah_design', lastMsg: 'I can start on Monday.', time: '1h ago', online: true },
  { id: '3', username: 'mike_builds', lastMsg: 'Invoice sent for the project.', time: '3h ago', online: false },
  { id: '4', username: 'julia_writes', lastMsg: 'Thanks for the opportunity!', time: '1d ago', online: false },
];

const Messages = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef(null);

  const { data, loading } = useQuery(GET_MESSAGES, {
    variables: { otherUserId: selectedContact?.id || '0' },
    skip: !selectedContact,
  });

  const [sendMessage, { loading: sending }] = useMutation(SEND_MESSAGE, {
    onCompleted: () => setInputText(''),
    refetchQueries: selectedContact ? [{ query: GET_MESSAGES, variables: { otherUserId: selectedContact.id } }] : [],
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedContact) return;
    sendMessage({ variables: { receiverId: selectedContact.id, content: inputText.trim() } });
  };

  const filtered = DEMO_CONTACTS.filter(c => c.username.toLowerCase().includes(search.toLowerCase()));
  const currentUser = localStorage.getItem('username');

  return (
    <div className="h-[calc(100vh-64px)] flex bg-white">
      {/* Sidebar */}
      <div className="w-80 border-r border-slate-100 flex flex-col shrink-0">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-extrabold text-slate-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input placeholder="Search conversations..." value={search} onChange={e => setSearch(e.target.value)}
              className="input-field py-2 pl-10 text-sm" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map(contact => (
            <button key={contact.id} onClick={() => setSelectedContact(contact)}
              className={`w-full text-left px-5 py-4 flex items-center gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 ${selectedContact?.id === contact.id ? 'bg-indigo-50 border-l-2 border-l-indigo-500' : ''}`}>
              <div className="relative shrink-0">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-700 text-sm">
                  {contact.username[0].toUpperCase()}
                </div>
                {contact.online && <Circle className="absolute -bottom-0.5 -right-0.5 fill-emerald-500 text-emerald-500" size={10} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-sm">@{contact.username}</span>
                  <span className="text-xs text-slate-400">{contact.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{contact.lastMsg}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {selectedContact ? (
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-700 text-sm">
                {selectedContact.username[0].toUpperCase()}
              </div>
              {selectedContact.online && <Circle className="absolute -bottom-0.5 -right-0.5 fill-emerald-500 text-emerald-500" size={10} />}
            </div>
            <div>
              <p className="font-bold text-slate-900">@{selectedContact.username}</p>
              <p className="text-xs text-slate-400">{selectedContact.online ? 'Online now' : 'Offline'}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : ''}`}>
                    <div className="h-10 bg-slate-100 rounded-2xl w-48 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : data?.messages?.length > 0 ? (
              data.messages.map(msg => {
                const isMe = msg.sender?.username === currentUser;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-md' : 'bg-slate-100 text-slate-900 rounded-bl-md'}`}>
                      <p>{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex-1 flex items-center justify-center h-full">
                <div className="text-center text-slate-400">
                  <MessageSquare className="mx-auto mb-3" size={32} />
                  <p className="font-medium text-sm">No messages yet</p>
                  <p className="text-xs mt-1">Say hello to @{selectedContact.username}!</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex items-center gap-3">
            <input value={inputText} onChange={e => setInputText(e.target.value)}
              placeholder={`Message @${selectedContact.username}...`}
              className="input-field py-3 flex-1" />
            <button type="submit" disabled={!inputText.trim() || sending}
              className="btn-primary p-3 aspect-square">
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-5">
            <MessageSquare size={36} />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 mb-1">Your Messages</h3>
          <p className="text-sm text-slate-500">Select a conversation to get started</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
