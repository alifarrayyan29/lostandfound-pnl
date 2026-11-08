import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard({ stats, chartData, latestPending = [] }) {
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

    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                    Admin Dashboard
                </h2>
                <p className="text-sm text-gray-400 mt-1">Ringkasan Sistem & Pemantauan Operasional LostFound PNL</p>
            </div>

            <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link 
                        href={route('admin.recapitulation.index')}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex items-center relative overflow-hidden group hover:shadow-md transition-all hover:-translate-y-0.5"
                    >
                        <div className="w-16 h-16 bg-orange-50 text-orange-400 rounded-2xl flex items-center justify-center mr-5 group-hover:bg-orange-100 transition-colors">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                        </div>
                        <div>
                            <div className="text-gray-400 text-xs font-bold uppercase tracking-wide">Total Laporan Masuk</div>
                            <div className="text-3xl font-black text-gray-800 mt-1">{stats.total_reports}</div>
                            <span className="text-xs text-[#ff6b35] font-bold mt-1 inline-block">Buka Rekapitulasi &rarr;</span>
                        </div>
                    </Link>
                    
                    <Link 
                        href={route('admin.verifications.index')}
                        className="bg-gradient-to-r from-[#ff8c5a] to-[#ff6b35] rounded-3xl p-6 shadow-md shadow-orange-200/50 flex items-center relative overflow-hidden text-white group hover:-translate-y-1 transition-transform"
                    >
                        <div className="absolute right-0 top-0 opacity-10">
                            <svg className="w-32 h-32 -mt-4 -mr-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-5 backdrop-blur-sm">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div className="relative z-10">
                            <div className="text-orange-100 text-xs font-bold uppercase tracking-wide">Klaim Menunggu Verifikasi</div>
                            <div className="text-3xl font-black mt-1">{stats.pending_claims}</div>
                            <span className="text-xs text-white/90 font-bold mt-1 inline-block underline">Periksa Sekarang &rarr;</span>
                        </div>
                    </Link>
                    
                    <Link 
                        href={route('admin.history.index')}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex items-center relative overflow-hidden group hover:shadow-md transition-all hover:-translate-y-0.5"
                    >
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mr-5 group-hover:bg-emerald-100 transition-colors">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <div>
                            <div className="text-gray-400 text-xs font-bold uppercase tracking-wide">Klaim Telah Disetujui</div>
                            <div className="text-3xl font-black text-gray-800 mt-1">{stats.resolved_claims}</div>
                            <span className="text-xs text-emerald-600 font-bold mt-1 inline-block">Lihat Riwayat &rarr;</span>
                        </div>
                    </Link>
                </div>

                {/* Quick Menu Shortcuts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link 
                        href={route('admin.verifications.index')}
                        className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 hover:shadow-md transition-all flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff6b35] flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">Verifikasi Klaim</h4>
                                <p className="text-xs text-gray-400">Persetujuan bukti kepemilikan</p>
                            </div>
                        </div>
                        <span className="text-orange-500 font-bold text-xs bg-orange-50 px-2.5 py-1 rounded-full">
                            {stats.pending_claims} Antrean
                        </span>
                    </Link>

                    <Link 
                        href={route('admin.history.index')}
                        className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 hover:shadow-md transition-all flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">Riwayat Klaim</h4>
                                <p className="text-xs text-gray-400">Catatan keputusan admin</p>
                            </div>
                        </div>
                        <span className="text-gray-400 text-xs font-bold">&rarr;</span>
                    </Link>

                    <Link 
                        href={route('admin.recapitulation.index')}
                        className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 hover:shadow-md transition-all flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">Rekapitulasi Laporan</h4>
                                <p className="text-xs text-gray-400">Cetak rekap & pantau status</p>
                            </div>
                        </div>
                        <span className="text-gray-400 text-xs font-bold">&rarr;</span>
                    </Link>
                </div>

                {/* Chart Section */}
                {chartData && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

                {/* Preview Klaim Menunggu Terkini */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Klaim Menunggu Verifikasi Terkini</h3>
                            <p className="text-xs text-gray-400 mt-0.5">5 antrean klaim terbaru yang memerlukan tindakan admin</p>
                        </div>
                        <Link 
                            href={route('admin.verifications.index')}
                            className="text-xs font-bold text-[#ff6b35] hover:text-[#e85c2c] hover:underline"
                        >
                            Buka Semua Klaim &rarr;
                        </Link>
                    </div>

                    {latestPending.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 font-medium text-sm">
                            Tidak ada klaim yang menunggu verifikasi saat ini.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Barang Temuan</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pengklaim</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {latestPending.map((claim) => (
                                        <tr key={claim.id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-gray-900">{claim.item_report.title}</div>
                                                <div className="text-xs text-gray-400">Penemu: {claim.item_report.user?.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-800">{claim.claimant?.name}</div>
                                                <div className="text-xs text-gray-400">{claim.claimant?.nim || claim.claimant?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                                                {new Date(claim.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                                                <Link
                                                    href={route('admin.verifications.index')}
                                                    className="px-4 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white rounded-full font-bold transition-colors inline-block"
                                                >
                                                    Periksa di Halaman Verifikasi
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
