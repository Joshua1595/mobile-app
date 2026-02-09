
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (username: string) => void;
  onGoToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onGoToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (password === '1234') {
      onLogin(username || 'Demo Patient');
    } else {
      setError('Invalid password. Hint: Use 1234');
    }
  };

  const handleQuickDemo = () => {
    setUsername('DemoPatient_01');
    setPassword('1234');
    // Short timeout to show the values filling in before redirect
    setTimeout(() => onLogin('Demo Patient'), 300);
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-white">
      <div className="mb-10 text-center">
        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-100">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">VitalGuard AI</h1>
        <p className="text-slate-500 mt-2 text-sm">Advanced Medical Monitoring System</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Patient Identifier</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-700 bg-slate-50/50"
            placeholder="e.g. PAT-9921"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Access Key (Use 1234)</label>
          <input
            type="password"
            required
            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-700 bg-slate-50/50"
            placeholder="••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        {error && (
          <div className="bg-rose-50 text-rose-600 px-4 py-2 rounded-lg text-xs font-medium border border-rose-100 animate-shake">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]"
        >
          Sign In
        </button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-300 font-bold tracking-widest">Or</span></div>
        </div>

        <button
          type="button"
          onClick={handleQuickDemo}
          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-4 rounded-xl transition-all border border-blue-100"
        >
          Try Quick Demo
        </button>
      </form>

      <div className="mt-8 text-center">
        <button onClick={onGoToRegister} className="text-slate-400 font-medium hover:text-blue-600 transition-colors text-sm">
          New to VitalGuard? <span className="font-bold underline">Create account</span>
        </button>
      </div>
    </div>
  );
};
