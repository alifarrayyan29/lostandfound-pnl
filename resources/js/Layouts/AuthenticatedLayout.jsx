import { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';

const SidebarLink = ({ href, active, children, icon }) => (
    <Link
        href={href}
        className={`flex items-center px-6 py-3.5 text-sm font-semibold rounded-r-full transition-all mb-1 mr-4 ${
            active 
                ? 'bg-gradient-to-r from-[#ff8c5a] to-[#ff6b35] text-white shadow-lg shadow-orange-200/50' 
                : 'text-[#f5a886] hover:bg-orange-50 hover:text-[#ff6b35]'
        }`}
    >
        <span className="mr-3 opacity-90">{icon}</span>
        {children}
    </Link>
);

export default function AuthenticatedLayout({ header, children }) {
    const { user } = usePage().props.auth;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    
    const [sidebarWidth, setSidebarWidth] = useState(260); // 260px default

    return (
        <div 
            className="min-h-screen bg-[#f1f3f5] flex flex-col md:flex-row font-sans"
            style={{ '--sidebar-width': `${sidebarWidth}px` }}
        >
            <style>{`
                @media (min-width: 768px) {
                    .md-dynamic-ml { margin-left: var(--sidebar-width); }
                }
            `}</style>

            {/* Sidebar Desktop */}
            <aside 
                className="hidden md:flex flex-col bg-white text-gray-800 min-h-screen fixed left-0 top-0 overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 rounded-r-3xl"
                style={{ width: 'var(--sidebar-width)' }}
            >
                <div className="flex items-center h-24 px-8 shrink-0 pt-4">
                    <div className="flex items-center gap-3 w-full">
                        {user.avatar ? (
                            <img src={`/storage/${user.avatar}`} alt={user.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600 shadow-sm shrink-0">
                                {user.name.charAt(0)}
                            </div>
                        )}
                        <div className="flex flex-col overflow-hidden">
                            <span className="font-bold text-gray-900 truncate text-sm">{user.name}</span>
                            <span className="text-xs text-gray-400 truncate">{user.role === 'admin' ? 'Administrator' : 'Mahasiswa'}</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 py-6 space-y-1 overflow-x-hidden">
                    {user.role === 'admin' ? (
                        <>
                            <p className="px-6 text-[12px] font-bold text-[#f5a886] mb-4">Admin Menu</p>
                            
                            <SidebarLink 
                                href={route('admin.dashboard')} 
                                active={route().current('admin.dashboard')}
                                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>}
                            >
                                Dashboard Admin
                            </SidebarLink>

                            <SidebarLink 
                                href={route('admin.categories.index')} 
                                active={route().current('admin.categories.*')} 
                                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>}
                            >
                                Kelola Kategori
                            </SidebarLink>

                            <SidebarLink 
                                href={route('admin.buildings.index')} 
                                active={route().current('admin.buildings.*')} 
                                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>}
                            >
                                Kelola Lokasi
                            </SidebarLink>
                        </>
                    ) : (
                        <>
                            <p className="px-6 text-[12px] font-bold text-[#f5a886] mb-4">General</p>
                            
                            <SidebarLink 
                                href={route('dashboard')} 
                                active={route().current('dashboard')}
                                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>}
                            >
                                Dashboard
                            </SidebarLink>
                            
                            <SidebarLink 
                                href={route('reports.index')} 
                                active={route().current('reports.*')}
                                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>}
                            >
                                Katalog
                            </SidebarLink>
                            
                            <SidebarLink 
                                href={route('messages.index')} 
                                active={route().current('messages.*')}
                                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>}
                            >
                                Kotak Masuk
                            </SidebarLink>
                            
                            <SidebarLink 
                                href={route('claims.index')} 
                                active={route().current('claims.*')}
                                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                            >
                                Klaim Saya
                            </SidebarLink>
                        </>
                    )}

                    <div className="pt-6 pb-2">
                        <p className="px-6 text-[12px] font-bold text-[#f5a886]">Account</p>
                    </div>
                    <SidebarLink 
                        href={route('profile.edit')} 
                        active={route().current('profile.edit')}
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>}
                    >
                        Setting
                    </SidebarLink>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center w-full px-6 py-3.5 text-sm font-semibold text-[#f5a886] hover:bg-orange-50 hover:text-[#ff6b35] rounded-r-full transition-all mb-1 mr-4"
                    >
                        <span className="mr-3 opacity-90">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        </span>
                        Log Out
                    </Link>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen md-dynamic-ml w-full overflow-x-hidden">
                {/* Mobile Header */}
                <nav className="md:hidden bg-white shadow-sm sticky top-0 z-30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="shrink-0 flex items-center">
                                    <Link href="/" className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-400 to-orange-500 flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">LF</span>
                                        </div>
                                        <span className="font-bold text-lg text-gray-800">LostFound</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="-mr-2 flex items-center">
                                <button
                                    onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-orange-400 hover:text-orange-500 hover:bg-orange-50 focus:outline-none transition duration-150 ease-in-out"
                                >
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                        <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' md:hidden absolute w-full bg-white shadow-lg z-40 rounded-b-2xl overflow-hidden'}>
                        <div className="pt-2 pb-3 space-y-1 px-2">
                            {user.role === 'admin' ? (
                                <>
                                    <ResponsiveNavLink href={route('admin.dashboard')} active={route().current('admin.dashboard')} className="rounded-xl">Dashboard Admin</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('admin.categories.index')} active={route().current('admin.categories.*')} className="rounded-xl">Kelola Kategori</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('admin.buildings.index')} active={route().current('admin.buildings.*')} className="rounded-xl">Kelola Lokasi</ResponsiveNavLink>
                                </>
                            ) : (
                                <>
                                    <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')} className="rounded-xl">Dashboard</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('reports.index')} active={route().current('reports.*')} className="rounded-xl">Katalog Laporan</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('messages.index')} active={route().current('messages.*')} className="rounded-xl">Kotak Masuk</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('claims.index')} active={route().current('claims.*')} className="rounded-xl">Riwayat Klaim</ResponsiveNavLink>
                                </>
                            )}
                        </div>
                        <div className="pt-4 pb-1 border-t border-gray-100 bg-gray-50">
                            <div className="px-4 flex items-center">
                                <div className="font-medium text-base text-gray-800">{user.name}</div>
                            </div>
                            <div className="mt-3 space-y-1 px-2">
                                <ResponsiveNavLink href={route('profile.edit')} className="rounded-xl">Profile</ResponsiveNavLink>
                                <ResponsiveNavLink method="post" href={route('logout')} as="button" className="rounded-xl text-left">
                                    Log Out
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </nav>

                <header className="hidden md:flex justify-between items-center py-6 px-8 z-10 w-full">
                    {/* Header Slot (Optional Search Bar usually goes here, but we can just render header if provided) */}
                    <div className="flex-1 flex items-center gap-4">
                        {header ? header : (
                            <div className="relative w-full max-w-xl">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Search Your Task, Project, Team..." 
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-orange-200 text-sm text-gray-600 bg-white"
                                />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-4 ml-4 shrink-0">
                        <button className="w-10 h-10 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center hover:bg-orange-200 transition-colors shadow-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        </button>
                        
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="relative w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center hover:bg-orange-100 transition-colors shadow-sm">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                                    {user.unread_notifications && user.unread_notifications.length > 0 && (
                                        <span className="absolute top-2 right-2.5 flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                    )}
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="right" width="48" contentClasses="py-1 bg-white rounded-2xl shadow-xl">
                                <div className="px-4 py-2 border-b border-gray-50 text-sm font-bold text-gray-700">Notifikasi</div>
                                {user.unread_notifications && user.unread_notifications.length > 0 ? (
                                    user.unread_notifications.map(notif => (
                                        <div key={notif.id} className="px-4 py-3 border-b border-gray-50 text-sm hover:bg-orange-50 cursor-pointer">
                                            <div className="font-medium text-gray-800">{notif.data.title}</div>
                                            <div className="text-gray-500 mt-1 text-xs">{notif.data.message}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-4 text-xs text-gray-500 text-center">Tidak ada notifikasi</div>
                                )}
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 pb-12 overflow-x-hidden pt-4 md:pt-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
