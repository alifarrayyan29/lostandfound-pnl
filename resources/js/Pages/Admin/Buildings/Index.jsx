import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ buildings }) {
    const [editingId, setEditingId] = useState(null);
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        latitude: '',
        longitude: ''
    });

    const submit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.buildings.update', editingId), {
                onSuccess: () => { reset(); setEditingId(null); }
            });
        } else {
            post(route('admin.buildings.store'), {
                onSuccess: () => reset()
            });
        }
    };

    const handleEdit = (building) => {
        setEditingId(building.id);
        setData({
            name: building.name,
            latitude: building.latitude || '',
            longitude: building.longitude || ''
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus gedung ini?')) {
            router.delete(route('admin.buildings.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Master Lokasi" />
            
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Master Lokasi Gedung
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">Kelola data lokasi di lingkungan kampus</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Form Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <form onSubmit={submit} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Nama Gedung</label>
                            <input 
                                type="text" 
                                className="block w-full border-gray-100 bg-gray-50/50 rounded-2xl shadow-none focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 text-sm py-3 px-4 transition-colors"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Contoh: Gedung Tata Niaga"
                                required
                            />
                            {errors.name && <div className="text-red-500 text-xs mt-2 font-medium">{errors.name}</div>}
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Latitude <span className="font-normal normal-case text-gray-400">(Opsional)</span></label>
                            <input 
                                type="text" 
                                className="block w-full border-gray-100 bg-gray-50/50 rounded-2xl shadow-none focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 text-sm py-3 px-4 transition-colors"
                                value={data.latitude}
                                onChange={e => setData('latitude', e.target.value)}
                                placeholder="-5.123456"
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Longitude <span className="font-normal normal-case text-gray-400">(Opsional)</span></label>
                            <input 
                                type="text" 
                                className="block w-full border-gray-100 bg-gray-50/50 rounded-2xl shadow-none focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 text-sm py-3 px-4 transition-colors"
                                value={data.longitude}
                                onChange={e => setData('longitude', e.target.value)}
                                placeholder="119.123456"
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button type="submit" disabled={processing} className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#ff8c5a] to-[#ff6b35] hover:from-[#ff6b35] hover:to-[#e85c2c] text-white font-bold rounded-2xl shadow-md shadow-orange-200/50 transition-all disabled:opacity-70">
                                {editingId ? 'Update Lokasi' : 'Tambah Baru'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={() => { reset(); setEditingId(null); }} className="w-full md:w-auto px-6 py-3 bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold rounded-2xl transition-all">
                                    Batal
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Gedung</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Koordinat Peta</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {buildings.map(building => (
                                    <tr key={building.id} className="hover:bg-orange-50/30 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">{building.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">
                                            {building.latitude ? (
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3 h-3 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                                                    {building.latitude}, {building.longitude}
                                                </span>
                                            ) : (
                                                <span className="text-gray-300 italic">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleEdit(building)} className="text-orange-500 hover:text-orange-700 px-3 py-1 bg-orange-50 rounded-lg mr-2 transition-colors">Edit</button>
                                            <button onClick={() => handleDelete(building.id)} className="text-red-500 hover:text-red-700 px-3 py-1 bg-red-50 rounded-lg transition-colors">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
