import { Icons } from '@/components/Icons';

export const GuideModal = ({ setShowGuide }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50 dark:bg-neutral-800/50">
                <h3 className="text-lg font-bold flex items-center gap-2"><Icons.Help /> Panduan Dashboard</h3>
                <button onClick={()=>setShowGuide(false)} className="text-neutral-400 hover:text-red-500 transition-colors"><Icons.Close /></button>
            </div>
            <div className="p-6 space-y-5 text-sm text-neutral-600 dark:text-neutral-300">
                <div className="flex gap-4 items-start">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded text-blue-600"><Icons.Activity /></div>
                    <div>
                        <strong className="block text-neutral-900 dark:text-white mb-1">Monitoring Kualitas</strong>
                        Grafik lingkaran (Pie Chart) memperlihatkan rasio barang bagus vs rusak. Jika merah 5%, segera cek produksi.
                    </div>
                </div>
                <div className="flex gap-4 items-start">
                    <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded text-green-600"><Icons.Activity /></div>
                    <div>
                        <strong className="block text-neutral-900 dark:text-white mb-1">Tren Mesin</strong>
                        Grafik garis memantau kestabilan. Gunakan tombol "SUHU" atau "BERAT" untuk berpindah tampilan.
                    </div>
                </div>
                <div className="flex gap-4 items-start">
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded text-orange-600"><Icons.Filter /></div>
                    <div>
                        <strong className="block text-neutral-900 dark:text-white mb-1">Filter Data</strong>
                        Gunakan tanggal di atas untuk melihat data masa lalu (History). Jangan lupa tekan Reset untuk kembali ke mode live.
                    </div>
                </div>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 text-center border-t border-neutral-100 dark:border-neutral-800">
                <button onClick={()=>setShowGuide(false)} className="px-8 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition">
                    Saya Mengerti
                </button>
            </div>
        </div>
    </div>
);

export const ConfirmModal = ({ form, setShowConfirm, handleFinalSubmit }) => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
        <div className="bg-white dark:bg-neutral-900 w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-neutral-200 dark:border-neutral-800">
            <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                    <Icons.CheckCircle />
                </div>
                <h3 className="text-lg font-bold mb-2">Konfirmasi Data</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                    Apakah anda yakin data yang dimasukkan sudah benar?
                    <br/>
                    <span className="font-bold text-black dark:text-white mt-2 block">
                        {form.line} | Suhu: {form.suhu}°C | Berat: {form.berat} kg | Status: {form.kualitas}
                    </span>
                </p>
                <div className="flex gap-3">
                    <button onClick={()=>setShowConfirm(false)} className="flex-1 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl font-bold text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 transition">Batal</button>
                    <button onClick={handleFinalSubmit} className="flex-1 py-3 bg-blue-600 rounded-xl font-bold text-sm text-white hover:bg-blue-700 transition shadow-lg">Ya, Simpan</button>
                </div>
            </div>
        </div>
    </div>
);