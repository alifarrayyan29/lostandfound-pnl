import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ leaderboard, recentReports }) {
    const { user } = usePage().props.auth;
    const points = user.points || 0;
    
    // State for Leaderboard Tabs
    const [leaderboardTab, setLeaderboardTab] = useState('top3');

    let badge = { name: 'Bronze', color: 'bg-orange-100 text-orange-800' };
    if (points >= 50) {
        badge = { name: 'Gold', color: 'bg-gradient-to-r from-orange-400 to-orange-500 text-white' };
    } else if (points >= 10) {
        badge = { name: 'Silver', color: 'bg-gray-200 text-gray-800' };
    }
    
    // Filter leaderboard based on active tab
    const displayLeaderboard = leaderboardTab === 'top3' 
        ? leaderboard.slice(0, 3) 
        : leaderboard;

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Main Content) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Ringkasan Aktivitas</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Status Card 1 */}
                        <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-3xl p-6 shadow-[0_8px_30px_rgb(251,146,60,0.3)] text-white relative overflow-hidden">
                            <div className="absolute right-0 top-0 opacity-10">
                                <svg className="w-40 h-40 -mt-8 -mr-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"></path></svg>
                            </div>
                            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                                <div>
                                    <h3 className="text-2xl font-bold mb-1">Poin Kejujuran</h3>
                                    <p className="text-orange-100 text-sm">Terus laporkan barang temuan!</p>
                                </div>
                                <div>
                                    <div className="flex items-end justify-between mb-2">
                                        <div className="text-xs text-orange-100">Progress Poin</div>
                                        <div className="text-xs font-bold">% {points}</div>
                                    </div>
                                    <div className="w-full bg-orange-300/50 rounded-full h-1.5 mb-4">
                                        <div className="bg-white h-1.5 rounded-full" style={{ width: `${Math.min(points, 100)}%` }}></div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-orange-300 flex items-center justify-center text-xs font-bold shadow-sm">⭐</div>
                                        </div>
                                        <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                                            Badge: {badge.name}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Card 2 */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between gap-6 relative">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-1">Laporan Aktif</h3>
                                <p className="text-gray-400 text-sm">Menunggu validasi admin</p>
                            </div>
                            <div>
                                <div className="flex items-end justify-between mb-2">
                                    <div className="text-xs text-gray-500">Penyelesaian</div>
                                    <div className="text-xs font-bold text-gray-700">% 76</div>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                                    <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '76%' }}></div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-orange-50 text-orange-500 px-3 py-1 rounded-full text-xs font-medium border border-orange-100">
                                        Perlu Tindakan
                                    </div>
                                </div>
                            </div>
                            <div className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 cursor-pointer">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* Lower Section (Calendar/Chart placeholder) */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                         <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-800">Aktivitas Terbaru</h3>
                            <div className="flex gap-2">
                                <Link href={route('reports.index')} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </Link>
                            </div>
                        </div>
                        <div className="flex gap-8">
                            <div className="flex-1 space-y-2">
                                {!recentReports || recentReports.length === 0 ? (
                                    <p className="text-sm text-gray-400 italic text-center py-4">Belum ada aktivitas.</p>
                                ) : (
                                    recentReports.map(report => (
                                        <Link 
                                            key={report.id} 
                                            href={route('reports.show', report.id)}
                                            className="flex items-center gap-4 group cursor-pointer p-3 hover:bg-orange-50 rounded-2xl transition-colors border border-transparent hover:border-orange-100"
                                        >
                                            <div className="w-12 flex flex-col items-center justify-center">
                                                <span className={`font-bold ${report.type === 'lost' ? 'text-red-500' : 'text-emerald-500'}`}>
                                                    {new Date(report.created_at).getDate()}
                                                </span>
                                                <span className="text-[10px] uppercase font-bold text-gray-400">
                                                    {new Date(report.created_at).toLocaleString('id-ID', { month: 'short' })}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-800 group-hover:text-orange-500 transition-colors">
                                                    {report.title}
                                                </h4>
                                                <p className="text-xs text-gray-400">
                                                    {report.building?.name || 'Lokasi tidak diketahui'} • {report.type === 'lost' ? 'Kehilangan' : 'Ditemukan'}
                                                </p>
                                            </div>
                                            <div className="text-orange-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Chart Widget placeholder */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-64 flex flex-col relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4 z-10">
                            <h3 className="font-bold text-gray-800">Statistik Klaim</h3>
                            <div className="text-orange-500 text-sm font-medium flex items-center gap-1 cursor-pointer">
                                Bulan Ini <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                        <div className="flex-1 flex items-end justify-between z-10 text-xs text-gray-400 font-medium">
                            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                        </div>
                        {/* Decorative wave */}
                        <div className="absolute bottom-6 left-0 w-full h-32 bg-gradient-to-t from-orange-100/50 to-transparent flex items-end opacity-60">
                             <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-orange-200 fill-current opacity-30">
                                <path d="M0,50 C20,100 40,0 60,40 C80,80 100,20 100,20 L100,100 L0,100 Z" />
                            </svg>
                        </div>
                    </div>

                    {/* Leaderboard Widget */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Pahlawan Kejujuran</h3>
                        </div>
                        <div className="flex gap-2 mb-6">
                            <button 
                                onClick={() => setLeaderboardTab('semua')}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${leaderboardTab === 'semua' ? 'bg-orange-400 text-white shadow-sm shadow-orange-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                Semua
                            </button>
                            <button 
                                onClick={() => setLeaderboardTab('top3')}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${leaderboardTab === 'top3' ? 'bg-orange-400 text-white shadow-sm shadow-orange-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                Top 3
                            </button>
                            <button 
                                onClick={() => setLeaderboardTab('bulan_ini')}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${leaderboardTab === 'bulan_ini' ? 'bg-orange-400 text-white shadow-sm shadow-orange-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                Bulan Ini
                            </button>
                        </div>

                        <div className="space-y-4">
                            {!displayLeaderboard || displayLeaderboard.length === 0 ? (
                                <p className="text-sm text-gray-400 italic">Belum ada data pahlawan.</p>
                            ) : (
                                displayLeaderboard.map((champion, idx) => (
                                    <div key={champion.id} className="flex items-center gap-4 group">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center font-bold text-orange-600 shadow-sm border border-orange-100">
                                                {champion.name.charAt(0)}
                                            </div>
                                            {idx === 0 && leaderboardTab === 'top3' && <span className="absolute -top-1 -right-1 text-xs">👑</span>}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800 text-sm group-hover:text-orange-500 transition-colors">{champion.name}</h4>
                                            <p className="text-xs text-gray-400 truncate">{champion.nim}</p>
                                        </div>
                                        <div className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">
                                            {champion.points} pt
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
