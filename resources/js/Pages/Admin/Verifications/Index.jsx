import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { confirmDialog } from '@/Utils/sweetalert';

export default function Index({ claims = [] }) {
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [compareModalOpen, setCompareModalOpen] = useState(false);
    const [comparingClaim, setComparingClaim] = useState(null);

    const handleApprove = async (claim) => {
        const isConfirmed = await confirmDialog({
            title: 'Sahkan Klaim Kepemilikan?',
            text: `Pengesahan klaim atas "${claim.item_report.title}" untuk "${claim.claimant.name}". Klaim lain yang masih pending untuk barang ini akan otomatis ditolak.`,
            confirmButtonText: 'Ya, Sahkan Klaim',
            cancelButtonText: 'Batal',
            icon: 'question',
        });

        if (isConfirmed) {
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

    return (
        <AuthenticatedLayout>
            <Head title="Verifikasi Klaim" />

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                    Verifikasi Klaim Kepemilikan
                </h2>
                <p className="text-sm text-gray-400 mt-1">Periksa kesesuaian bukti kepemilikan sebelum mengesahkan serah terima barang temuan</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Daftar Klaim Menunggu Persetujuan</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Terdapat {claims.length} pengajuan klaim yang membutuhkan tindakan admin</p>
                    </div>
                    {claims.length > 0 && (
                        <span className="px-3 py-1 bg-orange-100 text-[#ff6b35] font-bold text-xs rounded-full">
                            {claims.length} Antrean
                        </span>
                    )}
                </div>

                {claims.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-orange-50 text-orange-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h4 className="text-base font-bold text-gray-800">Tidak Ada Antrean Verifikasi</h4>
                        <p className="text-gray-400 font-medium text-xs mt-1">Seluruh pengajuan klaim telah selesai diverifikasi oleh Admin.</p>
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
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {claims.map((claim) => (
                                    <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {claim.item_report.photo_path ? (
                                                    <img src={`/storage/${claim.item_report.photo_path}`} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-100" />
                                                ) : (
                                                    <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-xs shrink-0">No Img</div>
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
                                            <div className="text-sm font-bold text-gray-800">{claim.claimant?.name}</div>
                                            <div className="text-xs text-gray-400">{claim.claimant?.nim || claim.claimant?.email}</div>
                                            {claim.claimant?.whatsapp_number && (
                                                <div className="text-xs text-emerald-600 font-medium">WA: {claim.claimant.whatsapp_number}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">
                                            {new Date(claim.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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

            {/* Modal Tolak Klaim */}
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

