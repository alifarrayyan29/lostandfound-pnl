import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Scan({ qr }) {
    const { post, processing } = useForm({
        code: qr.code,
    });

    const submit = (e) => {
        e.preventDefault();
        if (confirm("Apakah Anda yakin telah menerima barang ini?")) {
            post(route('qr.handover'));
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Konfirmasi Penerimaan Barang</h2>}>
            <Head title="Terima Barang" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-3xl border border-emerald-100 text-center p-8 relative">
                        
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        
                        <h3 className="text-2xl font-black text-gray-900 mb-2">QR Code Valid!</h3>
                        <p className="text-gray-500 mb-8">Data laporan barang di bawah ini cocok dengan QR Code yang dipindai.</p>
                        
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left mb-8 space-y-4">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Nama Barang</p>
                                <p className="text-lg font-bold text-gray-900">{qr.item_report.title}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Kategori</p>
                                    <p className="text-sm font-bold text-gray-700">{qr.item_report.category?.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Status Saat Ini</p>
                                    <p className="text-sm font-bold text-gray-700 uppercase">{qr.item_report.status}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Penemu Barang</p>
                                <p className="text-sm font-bold text-gray-700">{qr.item_report.user?.name}</p>
                            </div>
                        </div>

                        {qr.status === 'handed_over' || qr.item_report.status === 'closed' ? (
                            <div className="bg-green-50 text-green-700 p-4 rounded-xl font-bold border border-green-200">
                                Barang ini sudah Anda terima dan laporan telah DITUTUP.
                            </div>
                        ) : (
                            <form onSubmit={submit}>
                                <PrimaryButton 
                                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-lg shadow-lg shadow-emerald-200 justify-center" 
                                    disabled={processing}
                                >
                                    Saya Telah Menerima Barang Ini
                                </PrimaryButton>
                                <p className="text-xs text-gray-400 mt-4">Dengan menekan tombol ini, Anda mengonfirmasi bahwa Anda telah menerima barang fisik dari penemu, dan poin penghargaan akan diberikan kepadanya.</p>
                            </form>
                        )}
                        
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
