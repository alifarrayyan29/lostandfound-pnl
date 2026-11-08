import Swal from 'sweetalert2';

// Konfigurasi SweetAlert2 yang proporsional, fleksibel, dan elegan
const CustomSwal = Swal.mixin({
    width: '26rem',
    buttonsStyling: false,
    customClass: {
        popup: 'rounded-2xl shadow-xl border border-gray-100 p-6',
        title: 'text-base font-bold text-gray-800',
        htmlContainer: 'text-xs sm:text-sm text-gray-500 leading-relaxed mt-1',
        icon: 'scale-75 my-1',
        actions: '!flex !items-center !justify-center !gap-2.5 !w-full !mt-5',
        confirmButton: 'px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#ff6b35] hover:bg-[#e85c2c] shadow-sm shadow-orange-200 transition-all cursor-pointer',
        cancelButton: 'px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-red-600 hover:bg-red-700 shadow-sm shadow-red-200 transition-all cursor-pointer',
    },
});

// Toast kecil di pojok kanan atas (untuk flash message sukses, gagal, dll)
export const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    },
    customClass: {
        popup: 'rounded-2xl shadow-lg border border-gray-100 px-4 py-2.5',
        title: 'text-xs sm:text-sm font-bold text-gray-800',
    },
});

/**
 * Menampilkan pesan sukses
 */
export const showSuccess = (title, message = '') => {
    return CustomSwal.fire({
        icon: 'success',
        title: title || 'Berhasil!',
        text: message,
        confirmButtonText: 'Selesai',
        iconColor: '#059669',
    });
};

/**
 * Menampilkan pesan error
 */
export const showError = (title, message = '') => {
    return CustomSwal.fire({
        icon: 'error',
        title: title || 'Terjadi Kesalahan',
        text: message,
        confirmButtonText: 'Tutup',
        iconColor: '#dc2626',
    });
};

/**
 * Dialog konfirmasi pengganti window.confirm()
 * @returns Promise<boolean> - true jika pengguna klik konfirmasi
 */
export const confirmDialog = async ({
    title = 'Apakah Anda yakin?',
    text = '',
    icon = 'warning',
    confirmButtonText = 'Ya, Lanjutkan',
    cancelButtonText = 'Batal',
    isDanger = false,
}) => {
    const result = await CustomSwal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        reverseButtons: true, // Tombol Batal di kiri (merah), Konfirmasi di kanan (oranye)
        customClass: {
            popup: 'rounded-2xl shadow-xl border border-gray-100 p-6',
            title: 'text-base font-bold text-gray-800',
            htmlContainer: 'text-xs sm:text-sm text-gray-500 leading-relaxed mt-1',
            icon: 'scale-75 my-1',
            actions: '!flex !items-center !justify-center !gap-2.5 !w-full !mt-5',
            confirmButton: isDanger
                ? 'px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-red-700 hover:bg-red-800 shadow-sm shadow-red-300 transition-all cursor-pointer'
                : 'px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#ff6b35] hover:bg-[#e85c2c] shadow-sm shadow-orange-200 transition-all cursor-pointer',
            cancelButton: 'px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-red-600 hover:bg-red-700 shadow-sm shadow-red-200 transition-all cursor-pointer',
        },
    });

    return result.isConfirmed;
};

export default CustomSwal;
