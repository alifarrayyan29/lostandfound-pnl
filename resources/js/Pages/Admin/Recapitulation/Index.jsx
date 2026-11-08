import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ reports = [], qrTags = {}, categories = [], buildings = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'lost' | 'found'
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'new' | 'claimed' | 'closed'
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [buildingFilter, setBuildingFilter] = useState('all');

    const filteredReports = reports.filter((report) => {
        const matchesSearch = 
            report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (report.user?.name && report.user.name.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesType = typeFilter === 'all' ? true : report.type === typeFilter;
        const matchesStatus = statusFilter === 'all' ? true : report.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' ? true : String(report.category_id) === String(categoryFilter);
        const matchesBuilding = buildingFilter === 'all' ? true : String(report.building_id) === String(buildingFilter);

        return matchesSearch && matchesType && matchesStatus && matchesCategory && matchesBuilding;
    });

    const printReport = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout>
            <Head title="Rekapitulasi Laporan" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 print:hidden">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Rekapitulasi Laporan Barang
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">Laporan menyeluruh seluruh barang hilang dan temuan di lingkungan Politeknik Negeri Lhokseumawe</p>
                </div>
                <button 
                    onClick={printReport} 
                    className="bg-gradient-to-r from-[#ff8c5a] to-[#ff6b35] hover:from-[#ff6b35] hover:to-[#e85c2c] text-white px-6 py-2.5 rounded-full shadow-md shadow-orange-200 transition-all font-medium flex items-center gap-2 self-start sm:self-auto"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    Cetak Rekap / PDF
                </button>
            </div>

            {/* Header Cetak Formal (Hanya muncul saat cetak) */}
            <div className="hidden print:block text-center border-b-2 border-gray-900 pb-4 mb-8">
                <h1 className="text-2xl font-black uppercase text-gray-900 tracking-wider">Laporan Rekapitulasi Lost & Found PNL</h1>
                <p className="text-sm text-gray-600 mt-1">Politeknik Negeri Lhokseumawe • Dicetak pada: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
                {/* Filter Controls (Hidden in Print) */}
                <div className="p-6 border-b border-gray-50 space-y-4 print:hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                        {/* Search Input */}
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                placeholder="Cari judul, deskripsi, atau pelapor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-2.5 px-3.5 text-xs border border-gray-200 rounded-xl focus:border-[#ff6b35] focus:ring focus:ring-orange-100"
                            />
                        </div>

                        {/* Filter Tipe */}
                        <div>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full py-2.5 px-3 text-xs border border-gray-200 rounded-xl focus:border-[#ff6b35] focus:ring focus:ring-orange-100"
                            >
                                <option value="all">Semua Tipe</option>
                                <option value="lost">Kehilangan (Lost)</option>
                                <option value="found">Ditemukan (Found)</option>
                            </select>
                        </div>

                        {/* Filter Status */}
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full py-2.5 px-3 text-xs border border-gray-200 rounded-xl focus:border-[#ff6b35] focus:ring focus:ring-orange-100"
                            >
                                <option value="all">Semua Status</option>
                                <option value="new">Baru (New)</option>
                                <option value="claimed">Diklaim (Claimed)</option>
                                <option value="closed">Selesai (Closed)</option>
                            </select>
                        </div>

                        {/* Filter Kategori */}
                        <div>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full py-2.5 px-3 text-xs border border-gray-200 rounded-xl focus:border-[#ff6b35] focus:ring focus:ring-orange-100"
                            >
                                <option value="all">Semua Kategori</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
                        <span>Menampilkan <strong>{filteredReports.length}</strong> dari {reports.length} total laporan</span>
                        {(searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || categoryFilter !== 'all' || buildingFilter !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setTypeFilter('all');
                                    setStatusFilter('all');
                                    setCategoryFilter('all');
                                    setBuildingFilter('all');
                                }}
                                className="text-[#ff6b35] hover:underline font-bold"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>
                </div>

                {filteredReports.length === 0 ? (
                    <div className="p-16 text-center text-gray-400 font-medium text-sm">
                        Tidak ada laporan yang sesuai dengan filter pencarian.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Barang</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pelapor</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori & Lokasi</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">QR Code</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider print:hidden">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredReports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {report.photo_path ? (
                                                    <img src={`/storage/${report.photo_path}`} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 border" />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-[10px] shrink-0">No Img</div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-bold text-gray-800">{report.title}</div>
                                                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                                                        report.type === 'lost' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
                                                    }`}>
                                                        {report.type === 'lost' ? 'Kehilangan' : 'Ditemukan'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-800">{report.user?.name || 'Anonim'}</div>
                                            <div className="text-xs text-gray-400">{report.user?.nim || report.user?.email || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-xs font-bold text-gray-700">{report.category?.name || '-'}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">{report.building?.name || '-'}</div>
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
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {qrTags[report.id] ? (
                                                <span className={`font-bold text-xs px-2.5 py-1 rounded-full uppercase ${
                                                    qrTags[report.id].status === 'active' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                    {qrTags[report.id].status === 'active' ? 'Siap Discan' : 'Diserahterimakan'}
                                                </span>
                                            ) : (
                                                <span className="text-gray-300 text-xs italic">-</span>
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
                )}
            </div>

            {/* Footer Cetak Formal (Hanya muncul saat cetak) */}
            <div className="hidden print:block mt-24 text-right">
                <p className="mb-20 text-gray-800">Mengetahui,<br/>Administrator Pos Keamanan PNL</p>
                <p className="font-bold underline">___________________________</p>
                <p className="text-xs text-gray-500 mt-1">NIP / ID Petugas</p>
            </div>
        </AuthenticatedLayout>
    );
}

