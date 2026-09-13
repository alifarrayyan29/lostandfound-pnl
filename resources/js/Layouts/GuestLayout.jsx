import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0 bg-gradient-to-br from-orange-50 via-[#f8f9fa] to-orange-100/50 relative overflow-hidden font-sans">
            {/* Decorative background blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl"></div>
            </div>

            <div>
                <Link href="/" className="flex flex-col items-center gap-3 group">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ff8c5a] to-[#ff6b35] flex items-center justify-center shadow-lg shadow-orange-200/50 group-hover:scale-105 transition-transform duration-300">
                        <span className="text-white font-black text-2xl tracking-tighter">LF</span>
                    </div>
                    <span className="font-bold text-2xl text-gray-800 tracking-tight">LostFound <span className="text-[#ff6b35]">PNL</span></span>
                </Link>
            </div>

            <div className="mt-8 w-full overflow-hidden bg-white/70 backdrop-blur-xl px-8 py-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white sm:max-w-md sm:rounded-[2rem]">
                {children}
            </div>
        </div>
    );
}
