import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, usePage, router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function Show({ otherUser, report, messages }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, reset } = useForm({
        receiver_id: otherUser.id,
        item_report_id: report ? report.id : null,
        content: ''
    });
    
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
        
        const interval = setInterval(() => {
            router.reload({ only: ['messages'], preserveScroll: true, preserveState: true });
        }, 5000);
        
        return () => clearInterval(interval);
    }, [messages]);

    const submit = (e) => {
        e.preventDefault();
        if (!data.content.trim()) return;
        post(route('messages.store'), {
            preserveScroll: true,
            onSuccess: () => reset('content')
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link href={route('messages.index')} className="text-gray-500 hover:text-gray-700">
                        &larr;
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-200 text-indigo-800 flex items-center justify-center font-bold">
                            {otherUser.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="font-bold text-lg text-gray-900 leading-tight">{otherUser.name}</h2>
                            {report && <span className="text-xs font-bold text-emerald-600">Terkait: {report.title}</span>}
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Chat dengan ${otherUser.name}`} />

            <div className="py-8 h-[calc(100vh-160px)] flex flex-col">
                <div className="max-w-4xl mx-auto w-full sm:px-6 lg:px-8 flex flex-col h-full">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100 flex flex-col h-full relative">
                        
                        {/* Messages Area */}
                        <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50 space-y-4">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-400 mt-20 text-sm font-medium">
                                    Belum ada riwayat pesan. Kirim pesan pertama Anda!
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isMe = msg.sender_id === auth.user.id;
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'}`}>
                                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                                                    {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <form onSubmit={submit} className="flex gap-2">
                                <input
                                    type="text"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    placeholder="Ketik pesan Anda..."
                                    className="flex-1 rounded-full border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 px-6"
                                    disabled={processing}
                                />
                                <button
                                    type="submit"
                                    disabled={processing || !data.content.trim()}
                                    className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center disabled:opacity-50 transition-colors shadow-md shadow-indigo-200"
                                >
                                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                                </button>
                            </form>
                        </div>
                        
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
