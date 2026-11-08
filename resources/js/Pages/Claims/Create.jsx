import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import CameraImageUpload from '@/Components/CameraImageUpload';

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
                                <InputLabel htmlFor="proof_photo" value="Unggah Foto Bukti (Kamera / File)" />
                                <div className="mt-2">
                                    <CameraImageUpload
                                        id="proof_photo"
                                        name="proof_photo"
                                        value={data.proof_photo}
                                        onChange={(file) => setData('proof_photo', file)}
                                        accentColor="emerald"
                                    />
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
