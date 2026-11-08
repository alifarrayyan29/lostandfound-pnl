import { useState, useRef, useEffect } from 'react';
import Modal from '@/Components/Modal';

export default function CameraImageUpload({
    id = 'photo',
    name = 'photo',
    value = null,
    onChange,
    label = 'Unggah Foto / Bukti',
    accentColor = 'blue', // 'blue' | 'emerald' | 'orange'
    error = null,
}) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
    const [stream, setStream] = useState(null);
    const [cameraError, setCameraError] = useState(null);
    const [facingMode, setFacingMode] = useState('environment'); // 'environment' (back) or 'user' (front)
    const [capturedDataUrl, setCapturedDataUrl] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const nativeCameraInputRef = useRef(null);

    // Warna tema
    const colorClasses = {
        blue: {
            border: 'hover:border-blue-400 focus-within:border-blue-500',
            buttonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200',
            buttonSecondary: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
            badge: 'bg-blue-50 text-blue-700 border-blue-200',
            ring: 'focus:ring-blue-500',
        },
        emerald: {
            border: 'hover:border-emerald-400 focus-within:border-emerald-500',
            buttonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200',
            buttonSecondary: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
            badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            ring: 'focus:ring-emerald-500',
        },
        orange: {
            border: 'hover:border-[#ff6b35] focus-within:border-[#ff6b35]',
            buttonPrimary: 'bg-[#ff6b35] hover:bg-[#e85c2c] text-white shadow-orange-200',
            buttonSecondary: 'bg-orange-50 text-orange-700 hover:bg-orange-100',
            badge: 'bg-orange-50 text-orange-700 border-orange-200',
            ring: 'focus:ring-[#ff6b35]',
        },
    }[accentColor] || colorClasses.blue;

    // Sinkronisasi preview saat value File berubah
    useEffect(() => {
        if (value && value instanceof File) {
            const url = URL.createObjectURL(value);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else if (typeof value === 'string' && value) {
            setPreviewUrl(value.startsWith('http') || value.startsWith('/') ? value : `/storage/${value}`);
        } else {
            setPreviewUrl(null);
        }
    }, [value]);

    // Handle buka kamera WebRTC
    const startCamera = async (mode = facingMode) => {
        setCameraError(null);
        setCapturedDataUrl(null);
        stopCamera();

        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Fitur kamera langsung tidak didukung di browser ini. Silakan gunakan opsi Kamera Bawaan HP.');
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: mode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            });

            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error('Camera access error:', err);
            let message = 'Tidak dapat mengakses kamera.';
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                message = 'Izin kamera ditolak. Berikan izin kamera di browser Anda, atau gunakan opsi Kamera Bawaan HP.';
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                message = 'Tidak ada perangkat kamera yang terdeteksi.';
            }
            setCameraError(message);
        }
    };

    // Matikan stream kamera
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    const handleOpenModal = () => {
        setIsCameraModalOpen(true);
        setTimeout(() => {
            startCamera(facingMode);
        }, 150);
    };

    const handleCloseModal = () => {
        stopCamera();
        setCapturedDataUrl(null);
        setIsCameraModalOpen(false);
    };

    // Balik kamera (Depan / Belakang)
    const toggleFacingMode = () => {
        const nextMode = facingMode === 'environment' ? 'user' : 'environment';
        setFacingMode(nextMode);
        startCamera(nextMode);
    };

    // Ambil foto dari video stream
    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        setIsCapturing(true);

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        const ctx = canvas.getContext('2d');
        if (facingMode === 'user') {
            // Mirror image untuk kamera depan agar natural
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedDataUrl(dataUrl);
        stopCamera();
        setIsCapturing(false);
    };

    // Gunakan hasil jepretan kamera
    const confirmCapturedPhoto = () => {
        if (!canvasRef.current) return;
        canvasRef.current.toBlob(
            (blob) => {
                if (blob) {
                    const timestamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
                    const file = new File([blob], `kamera_${timestamp}.jpg`, { type: 'image/jpeg' });
                    onChange(file);
                    handleCloseModal();
                }
            },
            'image/jpeg',
            0.9
        );
    };

    // Handle file input biasa (dari galeri / file komputer)
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file);
        }
    };

    // Hapus foto yang sudah dipilih
    const handleRemovePhoto = () => {
        onChange(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (nativeCameraInputRef.current) nativeCameraInputRef.current.value = '';
    };

    // Format bytes ke ukuran yang mudah dibaca
    const formatFileSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="w-full">
            {/* Input File Tersembunyi (Galeri/File) */}
            <input
                ref={fileInputRef}
                id={id}
                name={name}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
            />

            {/* Input Kamera Bawaan Tersembunyi (Khusus HP / Fallback) */}
            <input
                ref={nativeCameraInputRef}
                id={`${id}-native-camera`}
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={handleFileChange}
            />

            {/* Tampilan Ketika Foto Sudah Dipilih */}
            {previewUrl ? (
                <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-28 h-28 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-200 border border-gray-300 flex-shrink-0 shadow-sm">
                        <img
                            src={previewUrl}
                            alt="Pratinjau Foto"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 text-center sm:text-left min-w-0">
                        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-emerald-600 mb-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                            Foto Siap Diunggah
                        </div>
                        <p className="text-sm font-bold text-gray-800 truncate">
                            {value?.name || 'Foto Terpilih'}
                        </p>
                        {value?.size && (
                            <p className="text-xs text-gray-400 mt-0.5">
                                Ukuran: {formatFileSize(value.size)}
                            </p>
                        )}
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                            <button
                                type="button"
                                onClick={handleOpenModal}
                                className="text-xs px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                            >
                                <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                Foto Ulang
                            </button>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-xs px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                            >
                                <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                Pilih File Lain
                            </button>
                            <button
                                type="button"
                                onClick={handleRemovePhoto}
                                className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg transition-colors flex items-center gap-1"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Tampilan Belum Ada Foto: Dua Pilihan (Kamera & File) */
                <div className={`border-2 border-dashed border-gray-300 rounded-2xl p-6 bg-gray-50/60 ${colorClasses.border} transition-all text-center`}>
                    <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm text-gray-500">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>

                    <p className="text-sm font-bold text-gray-800 mb-1">
                        Ambil Foto atau Pilih Gambar
                    </p>
                    <p className="text-xs text-gray-400 mb-4 max-w-sm mx-auto">
                        Anda dapat langsung mengambil gambar lewat kamera HP/Laptop atau mengunggah dari berkas/galeri.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto">
                        {/* Tombol Kamera Langsung */}
                        <button
                            type="button"
                            onClick={handleOpenModal}
                            className={`w-full sm:w-auto py-2.5 px-5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] ${colorClasses.buttonPrimary}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            Gunakan Kamera
                        </button>

                        {/* Tombol Pilih File / Galeri */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full sm:w-auto py-2.5 px-5 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
                        >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            Pilih dari File / Galeri
                        </button>
                    </div>

                    <p className="text-[11px] text-gray-400 mt-3">
                        Format didukung: JPG, PNG, WEBP (Maksimal 5MB)
                    </p>
                </div>
            )}

            {/* Modal Kamera Interaktif */}
            <Modal show={isCameraModalOpen} onClose={handleCloseModal} maxWidth="lg">
                <div className="p-5 sm:p-6 bg-white rounded-2xl">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <h3 className="text-base font-bold text-gray-800">
                                {capturedDataUrl ? 'Hasil Foto' : 'Ambil Foto Langsung'}
                            </h3>
                        </div>
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    {/* Area Video / Pratinjau Foto */}
                    <div className="relative bg-black rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center mb-4 shadow-inner">
                        {cameraError ? (
                            <div className="p-6 text-center text-white">
                                <svg className="w-10 h-10 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                <p className="text-xs text-red-200 mb-4">{cameraError}</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleCloseModal();
                                        nativeCameraInputRef.current?.click();
                                    }}
                                    className="py-2 px-4 bg-white text-gray-900 rounded-xl font-bold text-xs shadow-md"
                                >
                                    Buka Kamera Bawaan HP
                                </button>
                            </div>
                        ) : capturedDataUrl ? (
                            <img
                                src={capturedDataUrl}
                                alt="Foto Ditangkap"
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                                />
                                {/* Grid Panduan Foto */}
                                <div className="absolute inset-0 border border-white/20 pointer-events-none grid grid-cols-3 grid-rows-3">
                                    <div className="border-r border-b border-white/10"></div>
                                    <div className="border-r border-b border-white/10"></div>
                                    <div className="border-b border-white/10"></div>
                                    <div className="border-r border-b border-white/10"></div>
                                    <div className="border-r border-b border-white/10"></div>
                                    <div className="border-b border-white/10"></div>
                                </div>
                            </>
                        )}

                        {/* Hidden Canvas untuk Capture */}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    {/* Tombol Kontrol Kamera */}
                    <div className="flex items-center justify-between gap-3">
                        {capturedDataUrl ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCapturedDataUrl(null);
                                        startCamera(facingMode);
                                    }}
                                    className="flex-1 py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                    Foto Ulang
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmCapturedPhoto}
                                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-200 transition-all active:scale-[0.98]"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                    Gunakan Foto Ini
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={toggleFacingMode}
                                    disabled={!stream || !!cameraError}
                                    className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                                    title="Ganti Kamera"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                    <span>Ganti ({facingMode == 'environment' ? 'Depan' : 'Belakang'})</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={capturePhoto}
                                    disabled={!stream || !!cameraError || isCapturing}
                                    className="flex-1 py-3 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    <div className="w-3.5 h-3.5 rounded-full bg-white animate-pulse"></div>
                                    Jepret Foto
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        handleCloseModal();
                                        nativeCameraInputRef.current?.click();
                                    }}
                                    className="py-3 px-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl font-bold text-xs"
                                    title="Buka Kamera Bawaan HP"
                                >
                                    Kamera HP
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
