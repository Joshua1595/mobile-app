
import React, { useState } from 'react';

interface RegisterProps {
  onRegister: (username: string) => void;
  onGoToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onGoToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(username || 'New User');
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
        <p className="text-slate-500 mt-2">Join VitalGuard to track your health</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="John Doe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Set Password</label>
          <input
            type="password"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          Register
        </button>
      </form>

      <div className="mt-8 text-center">
        <button onClick={onGoToLogin} className="text-blue-600 font-medium hover:underline text-sm">
          Already have an account? Sign In
        </button>
      </div>
    </div>
  );
};
