import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function Show({ report, hasClaimed, userClaim, approvedClaim, qrCodeUrl }) {
    const { auth } = usePage().props;
    const hasLocation = report.latitude && report.longitude;
    const position = hasLocation ? [report.latitude, report.longitude] : null;

    const handleGenerateQr = () => {
        router.post(route('qr.generate', report.id), {}, {
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Laporan</h2>
                    <Link href={route('reports.index')} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                        &larr; Kembali ke Katalog
                    </Link>
                </div>
            }
        >
            <Head title={report.title} />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100 flex flex-col md:flex-row">
                        
                        {/* Kolom Kiri: Gambar & Peta */}
                        <div className="md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-gray-100">
                            <div className="bg-gray-50 relative flex flex-col justify-center min-h-[300px] flex-1">
                                {report.photo_path ? (
                                    <img 
                                        src={`/storage/${report.photo_path}`} 
                                        alt={report.title}
                                        className="object-contain w-full h-full max-h-[400px]" 
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-400 p-12 text-center h-[300px]">
                                        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        <p>Tidak ada foto lampiran</p>
                                    </div>
                                )}
                                
                                <div className="absolute top-4 left-4">
                                    <span className={`px-4 py-2 text-sm font-bold rounded-full shadow-lg backdrop-blur-md border ${report.type === 'lost' ? 'bg-red-500/90 text-white border-red-600' : 'bg-emerald-500/90 text-white border-emerald-600'}`}>
                                        {report.type === 'lost' ? 'BARANG HILANG' : 'BARANG DITEMUKAN'}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Peta Lokasi */}
                            {hasLocation && (
                                <div className="h-[250px] w-full border-t border-gray-100 relative z-0">
                                    <MapContainer center={position} zoom={16} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; OpenStreetMap'
                                        />
                                        <Marker position={position}></Marker>
                                    </MapContainer>
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md shadow text-xs font-bold z-[400]">
                                        Titik Lokasi
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Kolom Kanan: Detail Informasi */}
                        <div className="md:w-1/2 p-8 flex flex-col bg-white">
                            <div className="mb-8">
                                <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{report.title}</h1>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 font-medium">
                                    <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                                        {report.category?.name}
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        {report.building?.name}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8 flex-1">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status Saat Ini</h3>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg text-sm font-extrabold capitalize shadow-sm">
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse"></div>
                                        {report.status}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Deskripsi Barang</h3>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                            {report.description}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Informasi Pelapor</h3>
                                    <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-blue-200 text-indigo-800 flex items-center justify-center font-bold text-xl shadow-sm border border-indigo-200">
                                            {report.user?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-gray-900">{report.user?.name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}</p>
                                        </div>
                                    </div>
                                </div>

                                {auth.user?.id === report.user_id && report.status === 'claimed' && (
                                    <div className="mt-8">
                                        <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Serah Terima & QR Code</h3>
                                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 flex flex-col items-center justify-center text-center">
                                            
                                            {approvedClaim && (
                                                <div className="mb-4 bg-white/90 p-3.5 rounded-xl border border-emerald-100 text-xs text-emerald-950 w-full max-w-sm text-left">
                                                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Pengklaim yang Disetujui:</span>
                                                    <div className="font-bold text-sm text-gray-900 mt-0.5">{approvedClaim.claimant?.name}</div>
                                                    <div className="text-gray-500 text-xs">{approvedClaim.claimant?.nim || approvedClaim.claimant?.email}</div>
                                                    {approvedClaim.claimant?.whatsapp_number && (
                                                        <div className="text-emerald-700 font-bold mt-1 text-xs">WhatsApp: {approvedClaim.claimant.whatsapp_number}</div>
                                                    )}
                                                </div>
                                            )}

                                            {qrCodeUrl ? (
                                                <>
                                                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 mb-3 inline-block">
                                                        <QRCodeSVG value={qrCodeUrl} size={160} fgColor="#047857" />
                                                    </div>
                                                    <p className="text-sm text-emerald-900 font-bold mb-1">Tunjukkan QR Code ini ke Pengklaim Barang!</p>
                                                    <p className="text-xs text-emerald-700 max-w-md mb-4">
                                                        Pengklaim ({approvedClaim?.claimant?.name || 'pemilik barang'}) harus memindai QR Code ini menggunakan HP mereka saat bertemu. Anda otomatis akan mendapatkan <strong>+10 Poin</strong> setelah mereka konfirmasi.
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={handleGenerateQr}
                                                        className="text-xs text-emerald-700 hover:text-emerald-800 font-bold underline flex items-center gap-1.5 transition-colors"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                                        Perbarui / Generate Ulang QR Code
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="py-3 flex flex-col items-center">
                                                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                                                    </div>
                                                    <h4 className="text-base font-bold text-gray-900 mb-1">Klaim Telah Disetujui Admin!</h4>
                                                    <p className="text-xs text-gray-600 max-w-sm mb-4">
                                                        Admin telah mengesahkan klaim atas barang ini. Silakan klik tombol di bawah untuk membuat QR Code serah terima yang siap dipindai oleh pengklaim.
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={handleGenerateQr}
                                                        className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-200 transition-all active:scale-[0.98] flex items-center gap-2 text-sm"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                                                        Generate QR Code Serah Terima
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {report.status === 'closed' && (
                                    <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Laporan Selesai</span>
                                        <p className="text-sm text-gray-700 font-medium mt-1">Barang ini telah berhasil diserahterimakan kepada pemiliknya yang sah.</p>
                                    </div>
                                )}
                            </div>

                            {/* Tombol Aksi */}
                            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
                                {/* 1. Pengguna belum klaim dan barang masih status 'new' */}
                                {report.type === 'found' && report.user_id !== auth.user?.id && !userClaim && report.status === 'new' && (
                                    <Link 
                                        href={route('claims.create', { report_id: report.id })} 
                                        className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        Ini Barang Saya! (Ajukan Klaim)
                                    </Link>
                                )}

                                {/* 2. Jika barang sudah claimed/closed dan pengguna belum klaim (tombol klaim nonaktif / off) */}
                                {report.type === 'found' && report.user_id !== auth.user?.id && !userClaim && report.status !== 'new' && (
                                    <div className="w-full py-4 px-4 bg-gray-100 text-gray-400 rounded-xl font-bold text-center border border-gray-200 flex justify-center items-center gap-2 cursor-not-allowed">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                        Klaim Ditutup (Barang Sudah {report.status === 'claimed' ? 'Diklaim' : 'Selesai'})
                                    </div>
                                )}

                                {/* 3. Jika pengguna yang sedang login sudah pernah mengajukan klaim */}
                                {userClaim && (
                                    <div className="flex flex-col gap-2">
                                        {userClaim.status === 'pending' && (
                                            <div className="w-full p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                                                <div className="flex items-center justify-center gap-2 text-amber-800 font-bold text-sm">
                                                    <svg className="w-5 h-5 text-amber-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                    Klaim Anda Sedang Menunggu Verifikasi Admin
                                                </div>
                                                <p className="text-xs text-amber-700 mt-1">Admin sedang memeriksa kesesuaian bukti kepemilikan Anda.</p>
                                            </div>
                                        )}

                                        {userClaim.status === 'approved' && (
                                            <div className="w-full p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                                                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1">
                                                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    Klaim Anda Telah Disetujui!
                                                </div>
                                                <p className="text-xs text-emerald-700 mb-3">
                                                    Silakan temui penemu barang ({report.user?.name}). Minta penemu barang untuk menampilkan QR Code di layarnya, lalu pindai (scan) QR tersebut untuk menyelesaikan serah terima.
                                                </p>
                                                {qrCodeUrl && report.status === 'claimed' && (
                                                    <a 
                                                        href={qrCodeUrl}
                                                        className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex justify-center items-center gap-1.5"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                                                        Buka Halaman Konfirmasi Serah Terima &rarr;
                                                    </a>
                                                )}
                                            </div>
                                        )}

                                        {userClaim.status === 'rejected' && (
                                            <div className="w-full p-4 bg-red-50 border border-red-200 rounded-xl">
                                                <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    Klaim Anda Ditolak oleh Admin
                                                </div>
                                                {userClaim.rejection_reason && (
                                                    <p className="text-xs text-red-700 mt-2 bg-white/80 p-2.5 rounded-lg border border-red-100">
                                                        <strong>Alasan:</strong> {userClaim.rejection_reason}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {report.user_id !== auth.user?.id && (
                                    <Link 
                                        href={route('messages.show', { user: report.user_id, report_id: report.id })}
                                        className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                                        Hubungi Pelapor via Pesan
                                    </Link>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
