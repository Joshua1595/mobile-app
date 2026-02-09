
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { HistoryItem } from '../types';

interface HistoryProps {
  onBack: () => void;
}

export const History: React.FC<HistoryProps> = ({ onBack }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('vguard_history');
    if (saved) setHistory(JSON.parse(saved).reverse());
  }, []);

  const chartData = history.map(h => ({
    time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    hr: h.heart_rate,
    temp: h.body_temperature
  }));

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
      <header className="px-6 py-6 bg-white border-b border-slate-100 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg">
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-slate-800">Health Trends</h2>
      </header>

      <div className="p-6 space-y-6">
        {/* Heart Rate Chart */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
            Heart Rate Trend (BPM)
          </h3>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" hide />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                <Tooltip />
                <Area type="monotone" dataKey="hr" stroke="#f43f5e" fillOpacity={1} fill="url(#colorHr)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Temperature Chart */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            Body Temp Trend (°C)
          </h3>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" hide />
                <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} hide />
                <Tooltip />
                <Area type="monotone" dataKey="temp" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Raw Log History</h3>
          {history.length === 0 ? (
            <p className="text-center py-10 text-slate-400 text-sm">No log data yet.</p>
          ) : (
            [...history].reverse().slice(0, 20).map((h, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                    {new Date(h.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`text-xs font-bold ${h.predicted_risk === 'High Risk' ? 'text-rose-500' : 'text-slate-700'}`}>
                    {h.predicted_risk}
                  </span>
                </div>
                <div className="flex gap-4">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">HR</p>
                    <p className="text-xs font-bold text-slate-800">{h.heart_rate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">TEMP</p>
                    <p className="text-xs font-bold text-slate-800">{h.body_temperature}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
