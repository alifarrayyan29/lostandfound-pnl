import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ reviewedClaims = [] }) {
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'approved' | 'rejected'
    const [searchTerm, setSearchTerm] = useState('');

    const filteredClaims = reviewedClaims.filter((claim) => {
        const matchesStatus = statusFilter === 'all' ? true : claim.status === statusFilter;
        const matchesSearch = 
            claim.item_report?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            claim.claimant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            claim.claimant?.nim?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (claim.rejection_reason && claim.rejection_reason.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesStatus && matchesSearch;
    });

    const approvedCount = reviewedClaims.filter(c => c.status === 'approved').length;
    const rejectedCount = reviewedClaims.filter(c => c.status === 'rejected').length;

    return (
        <AuthenticatedLayout>
            <Head title="Riwayat Verifikasi Klaim" />

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                    Riwayat Keputusan Klaim
                </h2>
                <p className="text-sm text-gray-400 mt-1">Daftar lengkap seluruh pengajuan klaim yang telah disetujui atau ditolak oleh Administrator</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
                {/* Filter and Search Bar */}
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Status Tabs */}
                    <div className="flex bg-gray-100 p-1 rounded-2xl self-start md:self-auto">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                statusFilter === 'all'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Semua ({reviewedClaims.length})
                        </button>
                        <button
                            onClick={() => setStatusFilter('approved')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                statusFilter === 'approved'
                                    ? 'bg-white text-emerald-700 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Disetujui ({approvedCount})
                        </button>
                        <button
                            onClick={() => setStatusFilter('rejected')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                statusFilter === 'rejected'
                                    ? 'bg-white text-red-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            Ditolak ({rejectedCount})
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-72">
                        <input
                            type="text"
                            placeholder="Cari barang atau nama pengklaim..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#ff6b35] focus:ring focus:ring-orange-100"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>
                </div>

                {filteredClaims.length === 0 ? (
                    <div className="p-16 text-center text-gray-400 font-medium text-sm">
                        Tidak ada riwayat klaim yang sesuai dengan pencarian atau filter.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Barang Diklaim</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pengklaim</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status Keputusan</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Catatan / Alasan</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Admin Pemeriksa</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Waktu Pemeriksaan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredClaims.map((claim) => (
                                    <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900">{claim.item_report.title}</div>
                                            <div className="text-xs text-gray-400">{claim.item_report.category?.name} • Lokasi: {claim.item_report.building?.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-800">{claim.claimant?.name}</div>
                                            <div className="text-xs text-gray-400">{claim.claimant?.nim || claim.claimant?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {claim.status === 'approved' ? (
                                                <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                    Disetujui
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 inline-flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                    Ditolak
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-600 max-w-xs">
                                            {claim.rejection_reason ? (
                                                <div className="bg-red-50/50 p-2 rounded-lg border border-red-100 text-red-700">
                                                    {claim.rejection_reason}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">Disahkan untuk serah terima</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                                            {claim.reviewer?.name || 'Administrator'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-gray-500 font-medium">
                                            {claim.reviewed_at ? new Date(claim.reviewed_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

