import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState, useEffect } from 'react';

// Perbaikan icon marker bawaan Leaflet di React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationPicker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export default function Create({ categories, buildings }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        type: 'lost',
        category_id: categories.length > 0 ? categories[0].id : '',
        building_id: buildings.length > 0 ? buildings[0].id : '',
        description: '',
        photo: null,
        latitude: '',
        longitude: '',
    });

    // Default center peta: Politeknik Negeri Lhokseumawe
    const defaultCenter = [5.1189, 97.1574]; 
    const [mapPosition, setMapPosition] = useState(null);

    useEffect(() => {
        if (mapPosition) {
            setData((prevData) => ({
                ...prevData,
                latitude: mapPosition.lat,
                longitude: mapPosition.lng
            }));
        }
    }, [mapPosition]);

    const submit = (e) => {
        e.preventDefault();
        post(route('reports.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Buat Laporan Baru</h2>}
        >
            <Head title="Buat Laporan" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                        <form onSubmit={submit} className="p-8 space-y-8">
                            
                            {/* Jenis Laporan */}
                            <div>
                                <InputLabel value="Jenis Laporan" className="mb-3 text-lg font-bold" />
                                <div className="flex gap-4">
                                    <label className={`flex-1 cursor-pointer flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${data.type === 'lost' ? 'border-red-500 bg-red-50 text-red-700 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <input type="radio" name="type" value="lost" checked={data.type === 'lost'} onChange={(e) => setData('type', e.target.value)} className="hidden" />
                                        <div className={`w-5 h-5 rounded-full border ${data.type === 'lost' ? 'border-[5px] border-red-500 bg-white' : 'border-gray-300'}`}></div>
                                        <span className="font-bold text-lg">Kehilangan Barang</span>
                                    </label>
                                    <label className={`flex-1 cursor-pointer flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${data.type === 'found' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <input type="radio" name="type" value="found" checked={data.type === 'found'} onChange={(e) => setData('type', e.target.value)} className="hidden" />
                                        <div className={`w-5 h-5 rounded-full border ${data.type === 'found' ? 'border-[5px] border-emerald-500 bg-white' : 'border-gray-300'}`}></div>
                                        <span className="font-bold text-lg">Menemukan Barang</span>
                                    </label>
                                </div>
                                <InputError message={errors.type} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <InputLabel htmlFor="title" value="Judul Laporan" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={data.title}
                                        className="mt-1 block w-full py-3 px-4 bg-gray-50 border-gray-200 focus:bg-white"
                                        isFocused={true}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Contoh: Dompet Hitam Kulit merk Eiger"
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="category_id" value="Kategori" />
                                    <select
                                        id="category_id"
                                        name="category_id"
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="mt-1 block w-full py-3 px-4 border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.category_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="building_id" value="Area Gedung" />
                                    <select
                                        id="building_id"
                                        name="building_id"
                                        value={data.building_id}
                                        onChange={(e) => setData('building_id', e.target.value)}
                                        className="mt-1 block w-full py-3 px-4 border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                                    >
                                        {buildings.map((bldg) => (
                                            <option key={bldg.id} value={bldg.id}>{bldg.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.building_id} className="mt-2" />
                                </div>
                            </div>

                            {/* Peta Interaktif */}
                            <div>
                                <InputLabel value="Titik Lokasi Spesifik di Peta (Klik untuk menandai)" />
                                <div className="mt-2 h-[300px] w-full rounded-xl overflow-hidden border-2 border-gray-200 z-0 relative">
                                    <MapContainer center={defaultCenter} zoom={15} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; OpenStreetMap contributors'
                                        />
                                        <LocationPicker position={mapPosition} setPosition={setMapPosition} />
                                    </MapContainer>
                                </div>
                                {mapPosition && (
                                    <p className="text-sm text-emerald-600 mt-2 font-medium">✓ Titik lokasi berhasil ditandai pada koordinat: {mapPosition.lat.toFixed(5)}, {mapPosition.lng.toFixed(5)}</p>
                                )}
                                <InputError message={errors.latitude} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Deskripsi Detail" />
                                <textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="mt-1 block w-full border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                                    rows="4"
                                    placeholder="Jelaskan ciri-ciri barang secara detail, jam perkiraan, dll..."
                                ></textarea>
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="photo" value="Unggah Foto (Sangat disarankan)" />
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label htmlFor="photo" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-2 py-1">
                                                <span>Pilih File</span>
                                                <input id="photo" name="photo" type="file" className="sr-only" onChange={(e) => setData('photo', e.target.files[0])} accept="image/*" />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                                        {data.photo && <p className="text-sm font-bold text-emerald-600 mt-2">{data.photo.name}</p>}
                                    </div>
                                </div>
                                <InputError message={errors.photo} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end pt-6 border-t border-gray-100">
                                <PrimaryButton className="w-full justify-center py-4 bg-blue-600 hover:bg-blue-700 text-lg shadow-lg shadow-blue-200" disabled={processing}>
                                    Kirim Laporan
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
