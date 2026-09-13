import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ report }) {
    const { data, setData, post, processing, errors } = useForm({
        item_report_id: report.id,
        proof_description: '',
        proof_photo: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('claims.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Pengajuan Klaim Kepemilikan</h2>
                    <Link href={route('reports.show', report.id)} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                        &larr; Batal
                    </Link>
                </div>
            }
        >
            <Head title="Ajukan Klaim" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Ringkasan Barang yang Diklaim */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8 flex gap-6 items-center">
                        {report.photo_path ? (
                            <img src={`/storage/${report.photo_path}`} alt={report.title} className="w-24 h-24 rounded-xl object-cover shadow-sm" />
                        ) : (
                            <div className="w-24 h-24 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-500">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                        )}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Mengklaim: {report.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{report.description}</p>
                            <p className="text-xs font-bold text-emerald-700 mt-2">Ditemukan di {report.building?.name}</p>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                        <form onSubmit={submit} className="p-8 space-y-8">
                            
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                                <h4 className="font-bold text-blue-800 mb-2">Syarat Pengajuan Klaim</h4>
                                <p className="text-sm text-blue-600">Untuk membuktikan bahwa barang ini milik Anda, mohon berikan ciri-ciri khusus (misal: isi dompet, password HP, goresan tertentu) atau unggah foto bukti kuat (seperti STNK, kwitansi, atau foto Anda saat memakai barang tersebut).</p>
                            </div>

                            <div>
                                <InputLabel htmlFor="proof_description" value="Deskripsi Bukti Kepemilikan" />
                                <textarea
                                    id="proof_description"
                                    name="proof_description"
                                    value={data.proof_description}
                                    onChange={(e) => setData('proof_description', e.target.value)}
                                    className="mt-2 block w-full py-3 px-4 border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500 rounded-lg shadow-sm"
                                    rows="5"
                                    placeholder="Contoh: Dompet ini berisi KTP atas nama saya (Budi), ada kartu ATM BCA, dan foto keluarga di lipatan depan..."
                                    required
                                ></textarea>
                                <InputError message={errors.proof_description} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="proof_photo" value="Unggah Foto Bukti (Opsional namun sangat disarankan)" />
                                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label htmlFor="proof_photo" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500 px-2 py-1">
                                                <span>Pilih File</span>
                                                <input id="proof_photo" name="proof_photo" type="file" className="sr-only" onChange={(e) => setData('proof_photo', e.target.files[0])} accept="image/*" />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                                        {data.proof_photo && <p className="text-sm font-bold text-emerald-600 mt-2">{data.proof_photo.name}</p>}
                                    </div>
                                </div>
                                <InputError message={errors.proof_photo} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end pt-6 border-t border-gray-100">
                                <PrimaryButton className="w-full justify-center py-4 bg-emerald-600 hover:bg-emerald-700 text-lg shadow-lg shadow-emerald-200" disabled={processing}>
                                    Kirim Pengajuan Klaim
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
