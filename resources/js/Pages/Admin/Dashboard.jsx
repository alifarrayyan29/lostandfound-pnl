import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard({ claims, stats, reports, qrTags, chartData }) {
    const handleAction = (claimId, status) => {
        if (confirm(`Apakah Anda yakin ingin ${status === 'approved' ? 'MENGESAHKAN' : 'MENOLAK'} klaim ini?`)) {
            router.patch(route('admin.claims.update', claimId), { status });
        }
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
        labels: ['Baru', 'Diverifikasi', 'Diklaim', 'Selesai'],
        datasets: [{
            data: [
                chartData?.status_distribution.new || 0, 
                chartData?.status_distribution.verified || 0,
                chartData?.status_distribution.claimed || 0,
                chartData?.status_distribution.closed || 0
            ],
            backgroundColor: ['#f5a886', '#ff8c5a', '#ff6b35', '#e85c2c'],
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
                    <p className="text-sm text-gray-400 mt-1">Verifikasi & Laporan Sistem</p>
                </div>
                <button onClick={printReport} className="bg-gradient-to-r from-[#ff8c5a] to-[#ff6b35] hover:from-[#ff6b35] hover:to-[#e85c2c] text-white px-6 py-2.5 rounded-full shadow-md shadow-orange-200 transition-all font-medium flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    Cetak PDF
                </button>
            </div>

            <div className="space-y-8 print:space-y-4 print:max-w-none">
                
                {/* Header for Print Only */}
                <div className="hidden print:block text-center border-b-2 border-gray-900 pb-4 mb-8">
                    <h1 className="text-3xl font-black uppercase text-gray-900 tracking-widest">Laporan Bulanan LostFound</h1>
                    <p className="text-gray-600 mt-2 font-bold">Dicetak pada: {new Date().toLocaleDateString('id-ID')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex items-center relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-orange-50 text-orange-400 rounded-2xl flex items-center justify-center mr-5">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                        </div>
                        <div>
                            <div className="text-gray-400 text-xs font-bold uppercase tracking-wide">Total Laporan Aktif</div>
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
                            <div className="text-orange-100 text-xs font-bold uppercase tracking-wide">Klaim Menunggu</div>
                            <div className="text-3xl font-black">{stats.pending_claims}</div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex items-center relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mr-5">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <div>
                            <div className="text-gray-400 text-xs font-bold uppercase tracking-wide">Klaim Selesai</div>
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
                            <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">Distribusi Status Barang</h3>
                            <div className="h-64 flex justify-center">
                                <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden print:break-before-page">
                    <div className="p-6 border-b border-gray-50">
                        <h3 className="text-lg font-bold text-gray-800">Verifikasi Klaim Menunggu</h3>
                    </div>
                    {claims.filter(c => c.status === 'pending').length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-orange-50 text-orange-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <p className="text-gray-400 font-medium">Tidak ada klaim yang menunggu verifikasi.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Barang & Bukti</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pengklaim</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider print:hidden">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {claims.filter(c => c.status === 'pending').map((claim) => (
                                        <tr key={claim.id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-gray-800">{claim.item_report.title}</div>
                                                <div className="text-sm text-gray-400 mt-1">{claim.proof_description}</div>
                                                {claim.proof_photo_path && (
                                                    <a href={`/storage/${claim.proof_photo_path}`} target="_blank" className="text-xs text-orange-500 hover:text-orange-600 hover:underline mt-1 inline-block font-bold print:hidden">
                                                        Lihat Foto Bukti &rarr;
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-800">{claim.claimant.name}</div>
                                                <div className="text-xs text-gray-400">{claim.claimant.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">
                                                {new Date(claim.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium print:hidden">
                                                <button onClick={() => handleAction(claim.id, 'approved')} className="text-orange-500 hover:text-white bg-orange-50 hover:bg-orange-500 px-4 py-1.5 rounded-full font-bold mr-2 transition-colors">Setuju</button>
                                                <button onClick={() => handleAction(claim.id, 'rejected')} className="text-gray-400 hover:text-white bg-gray-100 hover:bg-gray-400 px-4 py-1.5 rounded-full font-bold transition-colors">Tolak</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden print:break-before-page">
                    <div className="p-6 border-b border-gray-50">
                        <h3 className="text-lg font-bold text-gray-800">Rekapitulasi Daftar Laporan</h3>
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
                                    <tr key={report.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-800">{report.title}</div>
                                            <div className="text-xs text-gray-400">{report.type === 'lost' ? 'Kehilangan' : 'Ditemukan'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-800">{report.user?.name || 'Anonim'}</div>
                                            <div className="text-xs text-gray-400">{report.type === 'lost' ? 'Yang Kehilangan' : 'Penemu Barang'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-gray-100 text-gray-500 uppercase tracking-wide">{report.status}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap flex justify-center print:hidden">
                                            {qrTags[report.id] ? (
                                                <span className="text-orange-500 font-bold text-xs bg-orange-50 px-3 py-1 rounded-full uppercase">Ada QR</span>
                                            ) : (
                                                <span className="text-gray-300 text-xs italic">Belum dibuat</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right print:hidden">

                                            {qrTags[report.id] && qrTags[report.id].status === 'active' && (
                                                <span className="text-orange-500 text-xs font-bold bg-orange-50 px-3 py-1.5 rounded-full">Siap Discan</span>
                                            )}
                                            {qrTags[report.id] && qrTags[report.id].status === 'handed_over' && (
                                                <span className="text-gray-400 text-xs font-bold">Diserahterimakan</span>
                                            )}
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
        </AuthenticatedLayout>
    );
}
