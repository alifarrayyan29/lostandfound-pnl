import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
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

export default function Show({ report, hasClaimed }) {
    const { auth } = usePage().props;
    const hasLocation = report.latitude && report.longitude;
    const position = hasLocation ? [report.latitude, report.longitude] : null;

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
                            </div>

                            {/* Tombol Aksi */}
                            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
                                {report.type === 'found' && report.user_id !== auth.user?.id && !hasClaimed && (
                                    <Link href={route('claims.create', { report_id: report.id })} className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] flex justify-center items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        Ini Barang Saya! (Ajukan Klaim)
                                    </Link>
                                )}
                                {hasClaimed && (
                                    <div className="w-full py-4 px-4 bg-gray-100 text-gray-500 rounded-xl font-bold text-center border border-gray-200 flex justify-center items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        Klaim Sedang Diproses
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
