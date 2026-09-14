import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Welcome({ auth }) {
    const [isSwapped, setIsSwapped] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsSwapped(prev => !prev);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head title="Selamat Datang" />
            
            <div className="font-sans min-h-screen flex flex-col bg-white overflow-hidden text-gray-800">
                {/* HERO SECTION */}
                <section id="beranda" className="relative w-full bg-[#FF6B35] text-white pt-6 pb-40 overflow-visible">
                    {/* Floating Decorative Shapes */}
                    <div className="absolute top-20 left-10 w-8 h-8 rounded-full border-4 border-emerald-400 opacity-80 animate-pulse"></div>
                    <div className="absolute top-40 right-20 w-12 h-12 bg-yellow-400 opacity-90 rotate-45 transform"></div>
                    <div className="absolute bottom-20 left-1/4 w-10 h-10 border-4 border-blue-400 rounded-full opacity-80"></div>
                    <div className="absolute top-32 right-1/4 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[25px] border-b-white opacity-70 rotate-12"></div>
                    
                    {/* Wavy ZigZag */}
                    <div className="absolute top-24 left-1/3 flex gap-1 opacity-70">
                        <div className="w-4 h-4 bg-yellow-300 rounded-full"></div>
                        <div className="w-4 h-4 bg-yellow-300 rounded-full -mt-2"></div>
                        <div className="w-4 h-4 bg-yellow-300 rounded-full"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        {/* Navbar */}
                        <header className="flex justify-between items-center py-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-white text-[#FF6B35] rounded-xl flex items-center justify-center font-black text-xl shadow-lg">
                                    LF
                                </div>
                                <span className="font-bold text-2xl tracking-tight">LostFound <span className="text-yellow-300">PNL</span></span>
                            </div>
                            
                            <nav className="hidden md:flex gap-8 font-bold text-sm items-center">
                                <a href="#beranda" className="hover:text-yellow-200 transition-colors">BERANDA</a>
                                <a href="#tentang" className="hover:text-yellow-200 transition-colors">TENTANG KAMI</a>
                                <a href="#carakerja" className="hover:text-yellow-200 transition-colors">CARA KERJA</a>
                            </nav>
                            
                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-white text-[#FF6B35] px-6 py-2.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all transform hover:-translate-y-0.5"
                                    >
                                        DASHBOARD
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="font-bold hover:text-yellow-200 transition-colors">
                                            MASUK
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-yellow-400 text-[#FF6B35] px-6 py-2.5 rounded-full font-black shadow-lg hover:bg-yellow-300 transition-all transform hover:-translate-y-0.5"
                                        >
                                            DAFTAR
                                        </Link>
                                    </>
                                )}
                            </div>
                        </header>

                        {/* Hero Content */}
                        <div className="flex flex-col md:flex-row items-center mt-20 gap-12">
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tight text-white drop-shadow-md">
                                    TEMUKAN<br/>
                                    <span className="text-yellow-300">BARANGMU!</span><br/>
                                    JADILAH PAHLAWAN!
                                </h1>
                                <p className="text-lg text-orange-100 font-medium mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
                                    Platform digital terpadu untuk lingkungan kampus. Laporkan barang berharga yang hilang, atau kembalikan barang temuan untuk menjadi Pahlawan Kejujuran kampus kita!
                                </p>
                                <div className="flex justify-center md:justify-start gap-4">
                                    <Link href={route('login')} className="bg-white text-[#FF6B35] px-8 py-4 rounded-full font-black shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-2">
                                        LAPORKAN SEKARANG
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </Link>
                                </div>
                            </div>

                            <div className="flex-1 relative w-full h-[400px] hidden md:block perspective-1000">
                                {/* Simulated 3D Illustration using floating divs */}
                                <div className={`absolute w-64 h-80 bg-white rounded-3xl shadow-2xl flex flex-col p-6 transition-all duration-1000 ease-in-out ${isSwapped ? 'top-10 right-40 -rotate-6 z-10 scale-90 opacity-70' : 'top-0 right-10 rotate-12 z-20 scale-100 opacity-100'}`}>
                                    <div className="w-full h-32 bg-gray-100 rounded-2xl mb-4 overflow-hidden relative shadow-inner">
                                        <img src="/found_item_phone.jpg" alt="Lost Phone" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="mb-auto mt-2">
                                        <h3 className="font-bold text-gray-800 text-sm mb-1 leading-tight">Kehilangan Sesuatu?</h3>
                                        <p className="text-[11px] text-gray-500 leading-tight font-medium">Segera laporkan agar cepat kembali.</p>
                                    </div>
                                    <div className="mt-4 bg-blue-500 text-white text-center py-2 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md">Lost Item</div>
                                </div>
                                <div className={`absolute w-64 h-80 bg-[#f8f9fa] rounded-3xl shadow-2xl flex flex-col p-6 border-4 border-white transition-all duration-1000 ease-in-out ${isSwapped ? 'top-0 right-10 rotate-12 z-20 scale-100 opacity-100' : 'top-10 right-40 -rotate-6 z-10 scale-90 opacity-70'}`}>
                                    <div className="w-full h-32 bg-gray-100 rounded-2xl mb-4 overflow-hidden relative shadow-inner">
                                        <img src="/found_item_watch.jpg" alt="Found Watch" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="mb-auto mt-2">
                                        <h3 className="font-bold text-gray-800 text-sm mb-1 leading-tight">Menemukan Barang?</h3>
                                        <p className="text-[11px] text-gray-500 leading-tight font-medium">Bantu kembalikan dan jadilah pahlawan.</p>
                                    </div>
                                    <div className="mt-4 bg-yellow-400 text-yellow-900 text-center py-2 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md">Found Item</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Wavy Bottom Divider */}
                    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
                        <svg className="relative block w-full h-[150px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,115.15,189.92,97.6,236.42,83.74,278.43,70.19,321.39,56.44Z" fill="#ffffff"></path>
                        </svg>
                    </div>
                </section>

                {/* QUOTE SECTION */}
                <section id="tentang" className="bg-white py-20 relative text-center px-6">
                    <div className="absolute top-10 left-20 w-4 h-4 bg-blue-400 rotate-45"></div>
                    <div className="absolute bottom-10 right-20 w-5 h-5 rounded-full bg-green-400"></div>

                    <div className="max-w-3xl mx-auto">
                        <div className="text-[#FF6B35] text-6xl font-black mb-4">"</div>
                        <h2 className="text-3xl font-black text-gray-800 uppercase tracking-widest mb-6">
                            Kejujuran Dimulai dari Hal Kecil.
                        </h2>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Membangun ekosistem kampus yang aman dan terpercaya. Setiap barang yang Anda kembalikan, tidak hanya menyelamatkan hari seseorang, tapi juga membangun karakter integritas diri Anda sendiri. Jadilah pahlawan hari ini!
                        </p>
                        <div className="text-[#FF6B35] text-6xl font-black mt-4 rotate-180 inline-block">"</div>
                    </div>
                </section>

                {/* HOW IT WORKS SECTION */}
                <section id="carakerja" className="bg-[#f8f9fa] py-24 relative">
                    <div className="absolute -top-12 left-0 w-full overflow-hidden leading-none z-0">
                        <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M0,0V73.81C21.65,89.5,43.34,105,65,114,142.13,146,231.2,143,308,114c62.34-23.51,114.73-67.6,183-74,51.8-4.88,103.58,11.23,153,30,55.3,21,111,46.57,169,49,69.54,2.94,136.21-27.18,197-62,28.69-16.42,57.19-35.15,90-41V0Z" fill="#ffffff"></path>
                        </svg>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                        <h2 className="text-4xl font-black text-[#FF6B35] uppercase mb-16 tracking-widest">Bagaimana Cara Kerjanya ?</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {/* Step 1 */}
                            <div className="bg-white rounded-3xl p-10 shadow-lg shadow-gray-200/50 flex flex-col items-center relative transform hover:-translate-y-2 transition-transform">
                                <div className="absolute -top-6 -right-6 text-7xl font-black text-[#FF6B35] opacity-20">1</div>
                                <div className="w-32 h-32 mb-8 bg-blue-50 rounded-full flex items-center justify-center">
                                    <img src="https://api.dicebear.com/7.x/shapes/svg?seed=lost&backgroundColor=FF6B35" alt="Step 1" className="w-20 h-20 rounded-2xl shadow-sm" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Buat Laporan</h3>
                                <p className="text-gray-500 text-sm text-center">
                                    <span className="font-bold text-[#FF6B35]">Kehilangan barang?</span> Atau menemukan barang? Segera login dan buat laporan dengan detail yang jelas beserta foto barang tersebut.
                                </p>
                            </div>
                            
                            {/* Step 2 */}
                            <div className="bg-white rounded-3xl p-10 shadow-lg shadow-gray-200/50 flex flex-col items-center relative transform hover:-translate-y-2 transition-transform">
                                <div className="absolute -top-6 -right-6 text-7xl font-black text-yellow-400 opacity-30">2</div>
                                <div className="w-32 h-32 mb-8 bg-yellow-50 rounded-full flex items-center justify-center">
                                    <img src="https://api.dicebear.com/7.x/shapes/svg?seed=verify&backgroundColor=FFD166" alt="Step 2" className="w-20 h-20 rounded-2xl shadow-sm" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Ajukan Klaim</h3>
                                <p className="text-gray-500 text-sm text-center">
                                    Jika Anda melihat barang Anda di katalog, ajukan klaim dengan memberikan <span className="font-bold text-yellow-500">bukti yang kuat</span> (foto kepemilikan/ciri khusus) agar admin dapat memverifikasi.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="bg-white rounded-3xl p-10 shadow-lg shadow-gray-200/50 flex flex-col items-center relative transform hover:-translate-y-2 transition-transform">
                                <div className="absolute -top-6 -right-6 text-7xl font-black text-emerald-400 opacity-20">3</div>
                                <div className="w-32 h-32 mb-8 bg-emerald-50 rounded-full flex items-center justify-center">
                                    <img src="https://api.dicebear.com/7.x/shapes/svg?seed=success&backgroundColor=06D6A0" alt="Step 3" className="w-20 h-20 rounded-2xl shadow-sm" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Selesai!</h3>
                                <p className="text-gray-500 text-sm text-center">
                                    Setelah diverifikasi, Anda dapat bertemu dengan penemu barang. Scan <span className="font-bold text-emerald-500">QR Code</span> serah terima, dan barang kembali dengan aman!
                                </p>
                            </div>
                        </div>

                        <div className="mt-16">
                            <Link href={route('login')} className="inline-block bg-[#FF6B35] text-white px-10 py-4 rounded-full font-black shadow-lg shadow-orange-200 hover:shadow-xl hover:bg-orange-600 transition-all transform hover:-translate-y-1">
                                MULAI SEKARANG &rarr;
                            </Link>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="bg-[#302c5c] text-white pt-16 pb-8 border-t-[16px] border-yellow-400 relative">
                    <div className="absolute top-0 left-10 w-24 h-24 border-4 border-blue-400/20 rounded-full -translate-y-1/2"></div>
                    
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-10 border-b border-white/10">
                            <div className="text-left mb-6 md:mb-0">
                                <h3 className="text-2xl font-black mb-2 text-yellow-400">LOSTFOUND PNL</h3>
                                <p className="text-blue-200 text-sm max-w-sm">
                                    Membangun kampus yang lebih baik melalui kejujuran dan saling peduli. Politeknik Negeri Lhokseumawe.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF6B35] transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF6B35] transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                </a>
                            </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-blue-300 font-bold">
                            <div className="flex gap-6 mb-4 md:mb-0">
                                <a href="#beranda" className="hover:text-white">BERANDA</a>
                                <a href="#tentang" className="hover:text-white">TENTANG</a>
                                <a href="#carakerja" className="hover:text-white">CARA KERJA</a>
                            </div>
                            <div>
                                Copyright © 2026 LostFound PNL
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
