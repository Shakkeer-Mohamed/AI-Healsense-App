import React, { useState, useEffect } from 'react';
import {
    Activity, AlertCircle, CheckCircle2, UserCircle, Bell,
    ShieldCheck, ActivitySquare, BrainCircuit, Mic, Waves,
    TrendingUp, Calendar, Info, Clock, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';

// Mock Data for Charts
const recoveryTrendData = [
    { day: 'Day 1', score: 45 },
    { day: 'Day 2', score: 42 },
    { day: 'Day 3', score: 55 },
    { day: 'Day 4', score: 50 },
    { day: 'Day 5', score: 65 },
    { day: 'Day 6', score: 72 },
    { day: 'Day 7', score: 82 }, // Spike in risk
];

const mobilityTrendData = [
    { day: 'Mon', symmetry: 80 },
    { day: 'Tue', symmetry: 82 },
    { day: 'Wed', symmetry: 78 },
    { day: 'Thu', symmetry: 65 }, // Dropped
    { day: 'Fri', symmetry: 60 },
];

export default function App() {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getRiskColor = (score: number) => {
        if (score < 40) return { bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500', ring: 'ring-emerald-100' };
        if (score < 75) return { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500', ring: 'ring-amber-100' };
        return { bg: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-500', ring: 'ring-rose-100' };
    };

    const riskScore = 82; // High Risk Example
    const riskColors = getRiskColor(riskScore);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
            {/* Top Navbar */}
            <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <Activity className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-800">
                        HealSense <span className="text-blue-600 font-medium font-mono text-sm tracking-wider ml-1">PRO</span>
                    </h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-sm font-medium text-slate-500 hidden sm:block">{currentTime}</div>
                    <div className="relative cursor-pointer">
                        <Bell className="h-6 w-6 text-slate-400 hover:text-slate-600 transition" />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white border-2 border-white">
                            3
                        </span>
                    </div>
                    <div className="flex items-center gap-3 pl-6 border-l border-slate-200 cursor-pointer">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-semibold text-slate-700 leading-tight">Dr. Sarah Jenkins</span>
                            <span className="text-xs text-slate-500 font-medium">Orthopedic Surgery</span>
                        </div>
                        <div className="h-9 w-9 bg-slate-100 text-blue-700 font-bold rounded-full flex items-center justify-center border border-slate-200">
                            SJ
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
                {/* Global Metric Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <MetricCard title="Active Patients Monitored" value="124" trend="+4 this week" trendUp icon={<UserCircle className="text-blue-500" />} />
                    <MetricCard title="High Risk Alerts Today" value="3" trend="Needs immediate review" icon={<AlertCircle className="text-rose-500" />} highlight />
                    <MetricCard title="Average Recovery Score" value="28.4" trend="-2.1 from last week" trendUp icon={<ActivitySquare className="text-emerald-500" />} />
                    <MetricCard title="Avg Days Since Surgery" value="14.2" trend="Stable cohort" icon={<Calendar className="text-indigo-500" />} />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                    {/* Left Column: Timeline & Alerts (3 cols) */}
                    <div className="xl:col-span-3 space-y-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            Patient Recovery Timeline
                        </h2>
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-transparent"></div>

                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">

                                {/* Event 1 */}
                                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 rounded-xl border border-slate-100 p-3 shadow-sm">
                                        <div className="flex items-center justify-between space-x-2 mb-1">
                                            <div className="font-bold text-slate-800 text-sm">Surgery Date</div>
                                            <div className="text-xs font-medium text-slate-500">Oct 12</div>
                                        </div>
                                        <div className="text-xs text-slate-600">Total Knee Arthroplasty (Right)</div>
                                    </div>
                                </div>

                                {/* Event 2 */}
                                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-emerald-100 text-emerald-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white rounded-xl border border-slate-100 p-3 shadow-sm">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="font-bold text-slate-800 text-sm">Discharged</div>
                                            <div className="text-xs font-medium text-slate-500">Oct 14</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Event 3 - Alert */}
                                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-rose-100 text-rose-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ring-4 ring-rose-50">
                                        <AlertCircle className="w-4 h-4" />
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-rose-50/50 rounded-xl border border-rose-100 p-3 shadow-sm">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="font-bold text-rose-700 text-sm">Risk Spiked</div>
                                            <div className="text-xs font-bold text-rose-500">Today</div>
                                        </div>
                                        <div className="text-xs text-slate-700">Multimodal score exceeded 75 threshold.</div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Clinical Decision Panel */}
                        <div className="bg-white rounded-2xl border border-rose-200 shadow-lg shadow-rose-100/50 p-6 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-slate-800">Alert & Clinical Decision</h3>
                                <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full border border-rose-200 uppercase tracking-wide">
                                    High Priority
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                <span className="font-semibold text-slate-800">Explanation:</span> Patient exhibits a sharp decline in gait symmetry combined with elevated pain stress vocal markers. Wound image shows moderate localized redness.
                            </p>

                            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-5">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Suggested Actions</p>
                                <ul className="space-y-2 text-sm font-medium text-slate-700">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Schedule immediate telehealth review</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Prescribe anti-inflammatory check</li>
                                </ul>
                            </div>

                            <button className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-[0.98]">
                                Acknowledge & Contact Patient
                            </button>

                            <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                <ShieldCheck className="w-3 h-3" /> Human-in-the-loop Required
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Deep Dive (9 cols) */}
                    <div className="xl:col-span-9 space-y-6">

                        {/* Header for Patient Deep Dive */}
                        <div className="flex items-end justify-between border-b border-slate-200 pb-4">
                            <div>
                                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Patient Profile deep-dive</h2>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-extrabold text-slate-900">Johnathan Doe</h1>
                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md border border-slate-200">
                                        ID: #PT-88392
                                    </span>
                                </div>
                            </div>
                            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
                                View Full Medical History
                            </button>
                        </div>

                        {/* Main Risk Panel */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

                            {/* Circular Gauge */}
                            <div className="flex flex-col items-center justify-center relative">
                                <div className="relative flex items-center justify-center w-48 h-48">
                                    {/* Outer glow */}
                                    <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 ${riskColors.bg}`}></div>

                                    {/* SVG Gauge Implementation */}
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                                        <circle
                                            cx="50" cy="50" r="45"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            className={`${riskColors.text} transition-all duration-1000 ease-out`}
                                            strokeDasharray={`${(riskScore / 100) * 283} 283`}
                                        />
                                    </svg>
                                    <div className="absolute flex flex-col items-center justify-center">
                                        <span className="text-5xl font-black text-slate-800 tracking-tighter">{riskScore}</span>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Risk Score</span>
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-200">
                                    <BrainCircuit className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-bold text-slate-700">AI Confidence: 94%</span>
                                </div>
                            </div>

                            {/* Trend Chart */}
                            <div className="lg:col-span-2 h-full flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-slate-800 text-lg">7-Day Risk Trend</h3>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-rose-500 bg-rose-50 px-3 py-1 rounded-md">
                                        <TrendingUp className="w-4 h-4" /> +10 Pts vs yesterday
                                    </div>
                                </div>
                                <div className="flex-1 min-h-[200px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={recoveryTrendData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                                            />
                                            <Area type="monotone" dataKey="score" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Multi-Modal Analysis Grid */}
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <ActivitySquare className="w-5 h-5 text-blue-500" /> Multi-Modal AI Analysis Breakdown
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                {/* Wound Image */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-slate-800">Wound AI Analysis</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <ProgressBar label="Redness Score" value={65} color="bg-orange-500" />
                                        <ProgressBar label="Swelling Index" value={42} color="bg-amber-400" />

                                        <div className="pt-4 mt-4 border-t border-slate-100">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-semibold text-slate-600">Infection Probability</span>
                                                <span className="text-sm font-bold text-rose-600">38%</span>
                                            </div>
                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                <ArrowUpRight className="w-3 h-3 text-rose-500" /> +5% compared to baseline
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Gait Stability */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow relative overflow-hidden">
                                    <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /><path d="M12 4v7" /><path d="M12 11 9 22" /><path d="M12 11l3 11" /><path d="M5 9l7-2 7 2" /><path d="M9 22h-3" /><path d="M15 22h3" />
                                        </svg>
                                    </div>

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                            <Activity className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-bold text-slate-800">Gait Stability</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <ProgressBar label="Balance Score" value={54} color="bg-rose-500" />
                                        <ProgressBar label="Step Symmetry" value={60} color="bg-amber-500" />

                                        <div className="pt-4 mt-4 border-t border-slate-100 h-16">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={mobilityTrendData}>
                                                    <Line type="monotone" dataKey="symmetry" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                                                    <Tooltip contentStyle={{ fontSize: '10px', padding: '4px' }} cursor={false} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>

                                {/* Vocal Biomarker */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                                            <Mic className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-bold text-slate-800">Vocal Biomarker</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <ProgressBar label="Pain Stress Index" value={82} color="bg-rose-500" />
                                        <ProgressBar label="Voice Fatigue" value={65} color="bg-amber-500" />
                                        <ProgressBar label="Breathing Irregularity" value={30} color="bg-emerald-500" />

                                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                                                <Waves className="w-4 h-4 text-indigo-400" /> MFCC Analyzed
                                            </div>
                                            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">Confidence 91%</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="max-w-[1600px] mx-auto px-6 mt-8 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-slate-400 text-xs font-medium">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5 hover:text-slate-600 transition-colors">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        HIPAA Compliant Encrypted Data
                    </div>
                    <div className="flex items-center gap-1.5">
                        <UserCircle className="w-4 h-4 text-blue-500" />
                        Human-in-the-loop Active
                    </div>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Clinical decision-support tool. Not a replacement for professional medical judgment.
                </div>
            </footer>
        </div>
    );
}

// Small Helper Components
function MetricCard({ title, value, trend, icon, highlight = false, trendUp = false }: any) {
    return (
        <div className={`rounded-2xl p-5 border shadow-sm transition-all ${highlight ? 'bg-rose-50 border-rose-200 shadow-rose-100' : 'bg-white border-slate-200'
            }`}>
            <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-semibold text-slate-500 flex items-center gap-2 ${highlight ? 'text-rose-700' : ''}`}>
                    {title}
                </h3>
                <div className={`p-2 rounded-xl ${highlight ? 'bg-white shadow-sm' : 'bg-slate-50'}`}>
                    {icon}
                </div>
            </div>
            <div className="flex flex-col">
                <span className={`text-3xl font-black tracking-tight ${highlight ? 'text-rose-900' : 'text-slate-800'}`}>
                    {value}
                </span>
                <span className={`text-xs font-medium mt-1 flex items-center gap-1 ${highlight ? 'text-rose-600' : (trendUp ? 'text-emerald-600' : 'text-slate-500')
                    }`}>
                    {!highlight && (trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />)}
                    {trend}
                </span>
            </div>
        </div>
    );
}

function ProgressBar({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div>
            <div className="flex justify-between items-end mb-1.5">
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <span className="text-xs font-bold text-slate-500">{value}/100</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${value}%` }}></div>
            </div>
        </div>
    );
}
