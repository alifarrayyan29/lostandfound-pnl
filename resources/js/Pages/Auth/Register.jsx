import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        nim: '',
        major: '',
        email: '',
        whatsapp_number: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="nim" value="NIM (Nomor Induk Mahasiswa)" />
                    <TextInput
                        id="nim"
                        type="text"
                        name="nim"
                        value={data.nim}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('nim', e.target.value)}
                        required
                    />
                    <InputError message={errors.nim} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="major" value="Jurusan / Program Studi" />
                    <TextInput
                        id="major"
                        type="text"
                        name="major"
                        value={data.major}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('major', e.target.value)}
                        required
                    />
                    <InputError message={errors.major} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email Aktif" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="whatsapp_number" value="Nomor WhatsApp" />
                    <TextInput
                        id="whatsapp_number"
                        type="text"
                        name="whatsapp_number"
                        value={data.whatsapp_number}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('whatsapp_number', e.target.value)}
                        required
                    />
                    <InputError message={errors.whatsapp_number} className="mt-2" />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Sudah punya akun?
                    </Link>

                    <PrimaryButton className="ms-4 bg-indigo-600 hover:bg-indigo-700" disabled={processing}>
                        Daftar Akun
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
