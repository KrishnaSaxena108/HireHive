import React from 'react';
import { MessageSquare } from 'lucide-react';

const Messages = () => {
  return (
    <div className="p-8 bg-slate-50 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md border border-slate-100">
        <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
          <MessageSquare size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Messages Inbox</h2>
        <p className="text-slate-500 mb-6">Your conversation history with clients and freelancers will appear here.</p>
        <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Messages;