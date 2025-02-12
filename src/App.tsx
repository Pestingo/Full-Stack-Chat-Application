import React from 'react';
import { useAuthStore } from './store/authStore';
import { MessageSquare, LogOut } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Chat from './components/Chat';

function App() {
  const { user, signOut } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-indigo-600" />
              <h1 className="text-xl font-semibold text-gray-900">Chat App</h1>
            </div>
            {user && (
              <button
                onClick={signOut}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user ? <Chat /> : <Login />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            Designed by Pester Mbhetse (Pestingo) © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;