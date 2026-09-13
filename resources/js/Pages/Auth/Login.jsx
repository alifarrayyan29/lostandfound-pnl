import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nim: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Selamat Datang! 👋</h2>
                <p className="text-sm text-gray-500 mt-2">Silakan masuk menggunakan akun Anda.</p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label htmlFor="nim" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                        NIM / ID Admin
                    </label>
                    <input
                        id="nim"
                        type="text"
                        name="nim"
                        value={data.nim}
                        className="block w-full border-gray-100 bg-gray-50/50 rounded-2xl shadow-none focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 text-sm py-3 px-4 transition-colors"
                        autoComplete="username"
                        placeholder="Masukkan NIM atau ID"
                        autoFocus
                        onChange={(e) => setData('nim', e.target.value)}
                    />
                    <InputError message={errors.nim} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full border-gray-100 bg-gray-50/50 rounded-2xl shadow-none focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 text-sm py-3 px-4 transition-colors"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between mt-4">
                    <label className="flex items-center cursor-pointer group">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded text-[#ff6b35] focus:ring-[#ff6b35] border-gray-300"
                        />
                        <span className="ms-2 text-sm text-gray-500 font-medium group-hover:text-gray-700 transition-colors">
                            Ingat saya
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm font-bold text-[#ff6b35] hover:text-[#e85c2c] transition-colors"
                        >
                            Lupa password?
                        </Link>
                    )}
                </div>

                <div className="pt-4">
                    <button 
                        type="submit"
                        disabled={processing}
                        className="w-full bg-gradient-to-r from-[#ff8c5a] to-[#ff6b35] hover:from-[#ff6b35] hover:to-[#e85c2c] text-white font-bold py-3.5 px-4 rounded-full shadow-lg shadow-orange-200/50 transition-all transform active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {processing ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Log In'}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
