import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ conversations }) {
    const { user } = usePage().props.auth;
    const [activeTab, setActiveTab] = useState('all');

    // Filter conversations based on active tab
    const filteredConversations = conversations.filter(conv => {
        if (activeTab === 'all') return true;
        
        // Ensure conversation is tied to a report to distinguish Laporan Saya vs Klaim
        if (!conv.report) return true; // If no report is tied, show in all tabs or just 'all' (let's show it, or wait, 'Laporan Saya' means their report). Let's only match if there is a report for specific tabs.

        if (activeTab === 'laporan_saya') {
            return conv.report.user_id === user.id;
        }
        
        if (activeTab === 'klaim') {
            return conv.report.user_id !== user.id;
        }

        return true;
    });

    const activeTabClass = "px-6 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md shadow-orange-200/50 transition-all";
    const inactiveTabClass = "px-6 py-2 rounded-full text-sm font-bold bg-white text-gray-400 border border-gray-100 hover:text-orange-400 transition-colors";

    return (
        <AuthenticatedLayout>
            <Head title="Pesan" />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Pesan Baru
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">Kelola komunikasi Anda terkait laporan</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-100 pb-4">
                    <button 
                        onClick={() => setActiveTab('all')}
                        className={activeTab === 'all' ? activeTabClass : inactiveTabClass}
                    >
                        All
                    </button>
                    <button 
                        onClick={() => setActiveTab('laporan_saya')}
                        className={activeTab === 'laporan_saya' ? activeTabClass : inactiveTabClass}
                    >
                        Laporan Saya
                    </button>
                    <button 
                        onClick={() => setActiveTab('klaim')}
                        className={activeTab === 'klaim' ? activeTabClass : inactiveTabClass}
                    >
                        Klaim
                    </button>
                </div>

                <div className="mt-4">
                    {filteredConversations.length === 0 ? (
                        <div className="text-center py-16 px-6">
                            <div className="w-16 h-16 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Belum ada pesan</h3>
                            <p className="text-sm text-gray-400 mt-1">
                                {activeTab === 'all' ? 'Kotak masuk Anda masih kosong.' : 'Tidak ada pesan untuk kategori ini.'}
                            </p>
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {filteredConversations.map((conv, index) => (
                                <li key={index}>
                                    <Link 
                                        href={route('messages.show', { user: conv.other_user.id, report_id: conv.report?.id })}
                                        className="flex items-center p-4 hover:bg-orange-50/50 rounded-2xl transition-colors group border border-transparent hover:border-orange-100"
                                    >
                                        <div className="flex-shrink-0 relative">
                                            {conv.other_user.avatar ? (
                                                <img src={`/storage/${conv.other_user.avatar}`} alt="" className="w-12 h-12 rounded-full object-cover shadow-sm" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-100 to-orange-200 text-orange-600 flex items-center justify-center font-bold text-lg shadow-sm border border-orange-100">
                                                    {conv.other_user.name.charAt(0)}
                                                </div>
                                            )}
                                            {conv.unread_count > 0 && (
                                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow-sm border-2 border-white">
                                                    {conv.unread_count}
                                                </span>
                                            )}
                                        </div>
                                        <div className="ml-4 flex-1 overflow-hidden">
                                            <div className="flex items-baseline justify-between mb-1">
                                                <h3 className="text-sm font-bold text-gray-800 truncate group-hover:text-orange-500 transition-colors">
                                                    {conv.other_user.name}
                                                </h3>
                                                <span className="text-[11px] font-medium text-gray-400 shrink-0 ml-2">
                                                    {new Date(conv.last_message.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            {conv.report && (
                                                <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                                                    {conv.report.title}
                                                </div>
                                            )}
                                            <p className={`text-xs truncate ${conv.unread_count > 0 ? 'font-bold text-gray-800' : 'text-gray-500'}`}>
                                                {conv.last_message.sender_id === conv.other_user.id ? '' : 'Anda: '}
                                                {conv.last_message.content}
                                            </p>
                                        </div>
                                        <div className="text-orange-300 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
