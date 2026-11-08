import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard({ claims, reviewedClaims = [], stats, reports, qrTags, chartData }) {
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'history'
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [compareModalOpen, setCompareModalOpen] = useState(false);
    const [comparingClaim, setComparingClaim] = useState(null);

    const handleApprove = (claim) => {
        if (confirm(`Apakah Anda yakin ingin MENGESAHKAN klaim atas barang "${claim.item_report.title}" untuk pengklaim "${claim.claimant.name}"?\n\nKlaim lain yang masih pending untuk barang ini akan otomatis ditolak.`)) {
            router.patch(route('admin.claims.update', claim.id), { 
                status: 'approved' 
            });
        }
    };

    const openRejectModal = (claim) => {
        setSelectedClaim(claim);
        setRejectionReason('');
        setRejectModalOpen(true);
    };

    const submitRejection = (e) => {
        e.preventDefault();
        if (!selectedClaim || !rejectionReason.trim()) return;

        router.patch(route('admin.claims.update', selectedClaim.id), {
            status: 'rejected',
            rejection_reason: rejectionReason
        }, {
            onSuccess: () => {
                setRejectModalOpen(false);
                setSelectedClaim(null);
                setRejectionReason('');
            }
        });
    };

    const openCompareModal = (claim) => {
        setComparingClaim(claim);
        setCompareModalOpen(true);
    };

    const barData = {
        labels: ['Kehilangan (Lost)', 'Ditemukan (Found)'],
        datasets: [{
            label: 'Jumlah Laporan',
            data: [chartData?.type_distribution.lost || 0, chartData?.type_distribution.found || 0],
            backgroundColor: ['rgba(255, 140, 90, 0.9)', 'rgba(255, 107, 53, 0.9)'],
            borderRadius: 8,
        }]
    };

    const doughnutData = {
        labels: ['Baru', 'Diklaim', 'Selesai (Closed)'],
        datasets: [{
            data: [
                chartData?.status_distribution.new || 0, 
                chartData?.status_distribution.claimed || 0,
                chartData?.status_distribution.closed || 0
            ],
            backgroundColor: ['#f5a886', '#ff8c5a', '#10b981'],
            borderWidth: 0,
        }]
    };

    const printReport = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />

            <div className="flex justify-between items-center mb-8 print:hidden">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Admin Dashboard
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">Pusat Verifikasi Klaim & Monitoring Laporan Sistem</p>
                </div>
                <button onClick={printReport} className="bg-gradient-to-r from-[#ff8c5a] to-[#ff6b35] hover:from-[#ff6b35] hover:to-[#e85c2c] text-white px-6 py-2.5 rounded-full shadow-md shadow-orange-200 transition-all font-medium flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    Cetak Rekap
                </button>
            </div>

            <div className="space-y-8 print:space-y-4 print:max-w-none">
                
                {/* Header for Print Only */}
                <div className="hidden print:block text-center border-b-2 border-gray-900 pb-4 mb-8">
                    <h1 className="text-3xl font-black uppercase text-gray-900 tracking-widest">Laporan Bulanan LostFound PNL</h1>
                    <p className="text-gray-600 mt-2 font-bold">Dicetak pada: {new Date().toLocaleDateString('id-ID')}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex items-center relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-orange-50 text-orange-400 rounded-2xl flex items-center justify-center mr-5">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                        </div>
                        <div>
                            <div className="text-gray-400 text-xs font-bold uppercase tracking-wide">Total Laporan Masuk</div>
                            <div className="text-3xl font-black text-gray-800">{stats.total_reports}</div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-[#ff8c5a] to-[#ff6b35] rounded-3xl p-6 shadow-md shadow-orange-200/50 flex items-center relative overflow-hidden text-white group hover:-translate-y-1 transition-transform">
                        <div className="absolute right-0 top-0 opacity-10">
                            <svg className="w-32 h-32 -mt-4 -mr-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-5 backdrop-blur-sm">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div className="relative z-10">
                            <div className="text-orange-100 text-xs font-bold uppercase tracking-wide">Klaim Menunggu Verifikasi</div>
                            <div className="text-3xl font-black">{stats.pending_claims}</div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex items-center relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mr-5">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <div>
                            <div className="text-gray-400 text-xs font-bold uppercase tracking-wide">Klaim Telah Disetujui</div>
                            <div className="text-3xl font-black text-gray-800">{stats.resolved_claims}</div>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                {chartData && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:break-inside-avoid print:mt-10">
                        <div className="bg-white p-8 shadow-sm rounded-3xl border border-gray-50">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">Distribusi Tipe Laporan</h3>
                            <div className="h-64 flex justify-center">
                                <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                            </div>
                        </div>
                        <div className="bg-white p-8 shadow-sm rounded-3xl border border-gray-50">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">Siklus Status Barang</h3>
                            <div className="h-64 flex justify-center">
                                <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Section Verifikasi Klaim & Riwayat */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden print:break-before-page">
                    <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Verifikasi Klaim Kepemilikan</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Kelola dan pantau persetujuan kepemilikan barang temuan</p>
                        </div>

                        {/* Tab Switcher */}
                        <div className="flex bg-gray-100 p-1 rounded-2xl self-start sm:self-auto">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                    activeTab === 'pending'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <span>Menunggu ({claims.length})</span>
                                {claims.length > 0 && (
                                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                    activeTab === 'history'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <span>Riwayat Selesai ({reviewedClaims.length})</span>
                            </button>
                        </div>
                    </div>

                    {/* Tab 1: Menunggu Verifikasi */}
                    {activeTab === 'pending' && (
                        <div>
                            {claims.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-orange-50 text-orange-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <p className="text-gray-400 font-medium">Tidak ada klaim yang menunggu verifikasi saat ini.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead className="bg-gray-50/50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Barang Temuan (Laporan)</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Bukti dari Pengklaim</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pengklaim</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider print:hidden">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {claims.map((claim) => (
                                                <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            {claim.item_report.photo_path ? (
                                                                <img src={`/storage/${claim.item_report.photo_path}`} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0 border" />
                                                            ) : (
                                                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-xs shrink-0">No Img</div>
                                                            )}
                                                            <div>
                                                                <div className="text-sm font-bold text-gray-900">{claim.item_report.title}</div>
                                                                <div className="text-xs text-gray-400">Penemu: {claim.item_report.user?.name}</div>
                                                                <div className="text-xs text-emerald-600 font-medium">{claim.item_report.building?.name}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 max-w-xs">
                                                        <div className="text-sm text-gray-700 line-clamp-2">{claim.proof_description}</div>
                                                        <div className="flex items-center gap-3 mt-2">
                                                            {claim.proof_photo_path && (
                                                                <a href={`/storage/${claim.proof_photo_path}`} target="_blank" className="text-xs text-orange-500 hover:text-orange-600 font-bold hover:underline">
                                                                    Lihat Foto Bukti &rarr;
                                                                </a>
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={() => openCompareModal(claim)}
                                                                className="text-xs text-indigo-600 hover:text-indigo-700 font-bold hover:underline flex items-center gap-1"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                                                                Bandingkan Bukti
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-bold text-gray-800">{claim.claimant.name}</div>
                                                        <div className="text-xs text-gray-400">{claim.claimant.nim || claim.claimant.email}</div>
                                                        {claim.claimant.whatsapp_number && (
                                                            <div className="text-xs text-emerald-600 font-medium">WA: {claim.claimant.whatsapp_number}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">
                                                        {new Date(claim.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium print:hidden">
                                                        <button 
                                                            onClick={() => handleApprove(claim)} 
                                                            className="text-emerald-600 hover:text-white bg-emerald-50 hover:bg-emerald-600 px-4 py-1.5 rounded-full font-bold mr-2 transition-colors shadow-sm"
                                                        >
                                                            Setujui
                                                        </button>
                                                        <button 
                                                            onClick={() => openRejectModal(claim)} 
                                                            className="text-red-500 hover:text-white bg-red-50 hover:bg-red-500 px-4 py-1.5 rounded-full font-bold transition-colors shadow-sm"
                                                        >
                                                            Tolak
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 2: Riwayat Verifikasi (Selesai) */}
                    {activeTab === 'history' && (
                        <div>
                            {reviewedClaims.length === 0 ? (
                                <div className="p-12 text-center text-gray-400 font-medium">
                                    Belum ada riwayat klaim yang diverifikasi.
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
                                            {reviewedClaims.map((claim) => (
                                                <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-bold text-gray-900">{claim.item_report.title}</div>
                                                        <div className="text-xs text-gray-400">{claim.item_report.category?.name}</div>
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
                                                        {claim.rejection_reason || '-'}
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
                    )}
                </div>

                {/* Section Rekapitulasi Daftar Laporan */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden print:break-before-page">
                    <div className="p-6 border-b border-gray-50">
                        <h3 className="text-lg font-bold text-gray-800">Rekapitulasi Daftar Laporan Barang</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Seluruh laporan aktif dan selesai dalam sistem LostFound PNL</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Barang</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pelapor</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider print:hidden">QR Code</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider print:hidden">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-800">{report.title}</div>
                                            <div className="text-xs text-gray-400">{report.type === 'lost' ? 'Kehilangan' : 'Ditemukan'} • {report.category?.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-800">{report.user?.name || 'Anonim'}</div>
                                            <div className="text-xs text-gray-400">{report.type === 'lost' ? 'Yang Kehilangan' : 'Penemu Barang'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wide ${
                                                report.status === 'new' ? 'bg-blue-50 text-blue-600' :
                                                report.status === 'claimed' ? 'bg-orange-50 text-orange-600' :
                                                report.status === 'closed' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center print:hidden">
                                            {qrTags[report.id] ? (
                                                <span className={`font-bold text-xs px-3 py-1 rounded-full uppercase ${
                                                    qrTags[report.id].status === 'active' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                    {qrTags[report.id].status === 'active' ? 'Siap Discan' : 'Diserahterimakan'}
                                                </span>
                                            ) : (
                                                <span className="text-gray-300 text-xs italic">Belum dibuat</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right print:hidden">
                                            <Link
                                                href={route('reports.show', report.id)}
                                                className="text-xs text-[#ff6b35] hover:text-[#e85c2c] font-bold hover:underline"
                                            >
                                                Lihat Laporan &rarr;
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* Footer for Print Only */}
                <div className="hidden print:block mt-24 text-right">
                    <p className="mb-20 text-gray-800">Mengetahui,<br/>Administrator Pos Keamanan PNL</p>
                    <p className="font-bold">___________________________</p>
                </div>

            </div>

            {/* Modal Tolak Klaim dengan Alasan */}
            {rejectModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in duration-150">
                        <div className="flex items-center gap-3 text-red-600 mb-3">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Tolak Pengajuan Klaim</h3>
                                <p className="text-xs text-gray-400">Pengklaim: {selectedClaim?.claimant?.name}</p>
                            </div>
                        </div>

                        <form onSubmit={submitRejection} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Alasan Penolakan <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Contoh: Bukti foto dan ciri-ciri khusus yang disampaikan tidak sesuai dengan ciri fisik barang yang dilaporkan oleh penemu..."
                                    className="w-full border-gray-200 rounded-2xl p-3 text-sm focus:border-red-400 focus:ring focus:ring-red-100 transition-all"
                                    rows="4"
                                    required
                                    autoFocus
                                />
                                <p className="text-[11px] text-gray-400 mt-1">Alasan ini akan otomatis dikirimkan ke notifikasi pengklaim.</p>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setRejectModalOpen(false); setSelectedClaim(null); }}
                                    className="px-5 py-2.5 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={!rejectionReason.trim()}
                                    className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors shadow-md shadow-red-200"
                                >
                                    Konfirmasi Tolak Klaim
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Perbandingan Bukti Temuan vs Bukti Pengklaim */}
            {compareModalOpen && comparingClaim && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Perbandingan Bukti Temuan vs Bukti Pengklaim</h3>
                                <p className="text-xs text-gray-400 mt-1">Gunakan informasi ini untuk memastikan barang benar-benar milik pengklaim sebelum diverifikasi</p>
                            </div>
                            <button
                                onClick={() => { setCompareModalOpen(false); setComparingClaim(null); }}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Sisi Kiri: Laporan Penemu */}
                            <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100 flex flex-col">
                                <span className="text-[11px] font-bold text-[#ff6b35] uppercase tracking-wider mb-2">1. Laporan Temuan (Penemu Barang)</span>
                                <h4 className="text-base font-bold text-gray-900 mb-2">{comparingClaim.item_report.title}</h4>
                                
                                {comparingClaim.item_report.photo_path ? (
                                    <img 
                                        src={`/storage/${comparingClaim.item_report.photo_path}`} 
                                        alt="" 
                                        className="w-full h-48 object-cover rounded-xl mb-4 border border-orange-200/50" 
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-orange-100/50 rounded-xl mb-4 flex items-center justify-center text-orange-400 text-xs">
                                        Tidak ada foto laporan
                                    </div>
                                )}

                                <div className="space-y-2 text-xs flex-1">
                                    <div>
                                        <span className="font-bold text-gray-500">Deskripsi Barang:</span>
                                        <p className="text-gray-700 mt-0.5 bg-white p-3 rounded-lg border border-orange-100">{comparingClaim.item_report.description}</p>
                                    </div>
                                    <div className="flex justify-between pt-2 text-gray-600">
                                        <span>Lokasi Penemuan:</span>
                                        <span className="font-bold text-gray-800">{comparingClaim.item_report.building?.name}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Dilaporkan oleh:</span>
                                        <span className="font-bold text-gray-800">{comparingClaim.item_report.user?.name}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Sisi Kanan: Bukti Pengklaim */}
                            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 flex flex-col">
                                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-2">2. Pengajuan Klaim (Pemilik Barang)</span>
                                <h4 className="text-base font-bold text-gray-900 mb-2">Pengklaim: {comparingClaim.claimant?.name}</h4>
                                
                                {comparingClaim.proof_photo_path ? (
                                    <img 
                                        src={`/storage/${comparingClaim.proof_photo_path}`} 
                                        alt="" 
                                        className="w-full h-48 object-cover rounded-xl mb-4 border border-emerald-200/50" 
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-emerald-100/50 rounded-xl mb-4 flex items-center justify-center text-emerald-600 text-xs">
                                        Tidak ada lampiran foto bukti
                                    </div>
                                )}

                                <div className="space-y-2 text-xs flex-1">
                                    <div>
                                        <span className="font-bold text-gray-500">Ciri Khusus / Keterangan Bukti:</span>
                                        <p className="text-gray-700 mt-0.5 bg-white p-3 rounded-lg border border-emerald-100">{comparingClaim.proof_description}</p>
                                    </div>
                                    <div className="flex justify-between pt-2 text-gray-600">
                                        <span>Kontak Pengklaim:</span>
                                        <span className="font-bold text-gray-800">{comparingClaim.claimant?.whatsapp_number || comparingClaim.claimant?.email}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>NIM / Identitas:</span>
                                        <span className="font-bold text-gray-800">{comparingClaim.claimant?.nim || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => { setCompareModalOpen(false); setComparingClaim(null); }}
                                className="px-5 py-2.5 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-100"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => { 
                                    const cl = comparingClaim; 
                                    setCompareModalOpen(false); 
                                    setComparingClaim(null); 
                                    openRejectModal(cl); 
                                }}
                                className="px-5 py-2.5 rounded-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-colors"
                            >
                                Tolak Klaim
                            </button>
                            <button
                                onClick={() => { 
                                    const cl = comparingClaim; 
                                    setCompareModalOpen(false); 
                                    setComparingClaim(null); 
                                    handleApprove(cl); 
                                }}
                                className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-200"
                            >
                                Setujui Klaim Ini
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
