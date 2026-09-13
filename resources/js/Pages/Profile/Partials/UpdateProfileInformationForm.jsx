import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            nim: user.nim,
            major: user.major || '',
            email: user.email || '',
            whatsapp_number: user.whatsapp_number || '',
        });

    const submit = (e) => {
        e.preventDefault();

        // Inertia file uploads require POST method with _method inside data or header
        post(route('profile.update'), {
            _method: 'patch',
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <div>
                <InputLabel value="Foto Profil" />
                <div className="mt-2 flex items-center gap-x-3">
                    {user.avatar ? (
                        <img src={`/storage/${user.avatar}`} alt="Avatar" className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                        <span className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                            <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </span>
                    )}
                    <input
                        type="file"
                        className="rounded-md border border-gray-300 px-3 py-1 text-sm shadow-sm"
                        onChange={(e) => setData('avatar', e.target.files[0])}
                    />
                </div>
                <InputError className="mt-2" message={errors.avatar} />
            </div>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="nim" value="NIM" />
                    <TextInput
                        id="nim"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.nim}
                        onChange={(e) => setData('nim', e.target.value)}
                        required
                    />
                    <InputError className="mt-2" message={errors.nim} />
                </div>

                <div>
                    <InputLabel htmlFor="major" value="Jurusan" />
                    <TextInput
                        id="major"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.major}
                        onChange={(e) => setData('major', e.target.value)}
                        required
                    />
                    <InputError className="mt-2" message={errors.major} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email Aktif" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="whatsapp_number" value="Nomor WhatsApp" />

                    <TextInput
                        id="whatsapp_number"
                        className="mt-1 block w-full"
                        value={data.whatsapp_number}
                        onChange={(e) => setData('whatsapp_number', e.target.value)}
                        required
                        autoComplete="tel"
                    />

                    <InputError className="mt-2" message={errors.whatsapp_number} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
