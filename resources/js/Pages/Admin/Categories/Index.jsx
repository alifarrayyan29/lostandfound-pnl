import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ categories }) {
    const [editingId, setEditingId] = useState(null);
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.categories.update', editingId), {
                onSuccess: () => { reset(); setEditingId(null); }
            });
        } else {
            post(route('admin.categories.store'), {
                onSuccess: () => reset()
            });
        }
    };

    const handleEdit = (category) => {
        setEditingId(category.id);
        setData('name', category.name);
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus kategori ini?')) {
            router.delete(route('admin.categories.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Master Kategori" />
            
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Master Kategori
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">Kelola jenis barang yang bisa dilaporkan</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Form Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <form onSubmit={submit} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Nama Kategori</label>
                            <input 
                                type="text" 
                                className="block w-full border-gray-100 bg-gray-50/50 rounded-2xl shadow-none focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 text-sm py-3 px-4 transition-colors"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Contoh: Elektronik, Dokumen, dll."
                                required
                            />
                            {errors.name && <div className="text-red-500 text-xs mt-2 font-medium">{errors.name}</div>}
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button type="submit" disabled={processing} className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#ff8c5a] to-[#ff6b35] hover:from-[#ff6b35] hover:to-[#e85c2c] text-white font-bold rounded-2xl shadow-md shadow-orange-200/50 transition-all disabled:opacity-70">
                                {editingId ? 'Update Kategori' : 'Tambah Baru'}
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
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Kategori</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {categories.map(category => (
                                    <tr key={category.id} className="hover:bg-orange-50/30 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">{category.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">{category.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleEdit(category)} className="text-orange-500 hover:text-orange-700 px-3 py-1 bg-orange-50 rounded-lg mr-2 transition-colors">Edit</button>
                                            <button onClick={() => handleDelete(category.id)} className="text-red-500 hover:text-red-700 px-3 py-1 bg-red-50 rounded-lg transition-colors">Hapus</button>
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
