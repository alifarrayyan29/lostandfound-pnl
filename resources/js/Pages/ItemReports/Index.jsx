import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function Index({ reports, filters, categories, buildings }) {
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const [buildingId, setBuildingId] = useState(filters.building_id || '');
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            router.get(route('reports.index'), {
                search, type, category_id: categoryId, building_id: buildingId
            }, { preserveState: true, replace: true, preserveScroll: true });
        }, 300);

        return () => clearTimeout(timer);
    }, [search, type, categoryId, buildingId]);

    return (
        <AuthenticatedLayout>
            <Head title="Katalog Laporan" />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Katalog Laporan
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">Daftar barang hilang & ditemukan</p>
                </div>
                <Link
                    href={route('reports.create')}
                    className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-2.5 rounded-full shadow-md shadow-orange-200 transition-all font-medium flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Laporan Baru
                </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Pencarian</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input 
                                type="text" 
                                className="pl-11 block w-full border-gray-100 bg-gray-50/50 rounded-2xl shadow-none focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 text-sm py-3 transition-colors" 
                                placeholder="Cari nama barang..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Jenis</label>
                        <select 
                            className="block w-full border-gray-100 bg-gray-50/50 rounded-2xl shadow-none focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 text-sm py-3 transition-colors"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="">Semua Jenis</option>
                            <option value="lost">Kehilangan Barang</option>
                            <option value="found">Menemukan Barang</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Kategori</label>
                        <select 
                            className="block w-full border-gray-100 bg-gray-50/50 rounded-2xl shadow-none focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 text-sm py-3 transition-colors"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Lokasi</label>
                        <select 
                            className="block w-full border-gray-100 bg-gray-50/50 rounded-2xl shadow-none focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 text-sm py-3 transition-colors"
                            value={buildingId}
                            onChange={(e) => setBuildingId(e.target.value)}
                        >
                            <option value="">Semua Lokasi</option>
                            {buildings.map((b) => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.length === 0 ? (
                    <div className="col-span-full text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Tidak ada laporan</h3>
                        <p className="mt-1 text-sm text-gray-400">Coba ubah filter pencarian Anda.</p>
                    </div>
                ) : (
                    reports.map((report) => (
                        <Link href={route('reports.show', report.id)} key={report.id} className="block group">
                            <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:shadow-orange-100/50 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
                                <div className="aspect-[4/3] bg-gray-50 rounded-2xl relative overflow-hidden mb-4">
                                    {report.photo_path ? (
                                        <img 
                                            src={`/storage/${report.photo_path}`} 
                                            alt={report.title}
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-gray-300">
                                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${report.type === 'lost' ? 'bg-red-400 text-white' : 'bg-gradient-to-r from-orange-400 to-orange-500 text-white'}`}>
                                            {report.type === 'lost' ? 'Kehilangan' : 'Ditemukan'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col px-2">
                                    <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-orange-500 transition-colors line-clamp-1">{report.title}</h3>
                                    <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-1">{report.description}</p>
                                    
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                            <span className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                                            </span>
                                            <span className="truncate max-w-[80px]">{report.category?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                            <span className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                                            </span>
                                            <span className="truncate max-w-[80px]">{report.building?.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </AuthenticatedLayout>
    );
}
