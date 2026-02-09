import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { Alerts } from './components/Alerts';
import { History } from './components/History';
import { User } from './types';

type Screen = 'login' | 'register' | 'dashboard' | 'alerts' | 'history';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vguard_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentScreen, setCurrentScreen] = useState<Screen>(user ? 'dashboard' : 'login');
  const [isLive, setIsLive] = useState(true);

  const handleLogin = (username: string) => {
    const newUser = { id: '1', username, isLoggedIn: true };
    setUser(newUser);
    localStorage.setItem('vguard_user', JSON.stringify(newUser));
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('vguard_user');
    setCurrentScreen('login');
  };

  const isAuthScreen = currentScreen === 'login' || currentScreen === 'register';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden pb-16">
          {currentScreen === 'login' && <Login onLogin={handleLogin} onGoToRegister={() => setCurrentScreen('register')} />}
          {currentScreen === 'register' && <Register onRegister={handleLogin} onGoToLogin={() => setCurrentScreen('login')} />}
          {currentScreen === 'dashboard' && <Dashboard onLogout={handleLogout} isLive={isLive} />}
          {currentScreen === 'alerts' && <Alerts />}
          {/* Fix: Added the required onBack prop to the History component */}
          {currentScreen === 'history' && <History onBack={() => setCurrentScreen('dashboard')} />}
        </main>

        {/* Global Bottom Navigation (Only for logged-in users) */}
        {!isAuthScreen && (
          <nav className="absolute bottom-0 left-0 w-full h-16 bg-white border-t border-slate-100 flex items-center justify-around px-2 z-50">
            <button 
              onClick={() => setCurrentScreen('dashboard')}
              className={`flex flex-col items-center gap-1 flex-1 transition-colors ${currentScreen === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
            </button>

            <button 
              onClick={() => setCurrentScreen('alerts')}
              className={`flex flex-col items-center gap-1 flex-1 transition-colors ${currentScreen === 'alerts' ? 'text-rose-500' : 'text-slate-400'}`}
            >
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter">Alerts</span>
            </button>

            <button 
              onClick={() => setCurrentScreen('history')}
              className={`flex flex-col items-center gap-1 flex-1 transition-colors ${currentScreen === 'history' ? 'text-blue-500' : 'text-slate-400'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-tighter">History</span>
            </button>

            <button 
              onClick={() => setIsLive(!isLive)}
              className={`flex flex-col items-center gap-1 flex-1 transition-colors ${isLive ? 'text-green-500' : 'text-slate-300'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-tighter">{isLive ? 'Live' : 'Stop'}</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default App;