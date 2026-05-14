import { Icons } from '@/components/Icons';
import { SelectSimple } from '@/components/UIComponents';

export const FormSection = ({ form, setForm, handlePreSubmit, master }) => {
  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
        <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Input Manual</h3>
            <form onSubmit={handlePreSubmit} className="space-y-4">
                
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg space-y-3 border border-neutral-100 dark:border-neutral-800">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase flex items-center gap-1"><Icons.Filter /> Identitas</label>
                    <div className="grid grid-cols-2 gap-3">
                        <SelectSimple value={form.group} onChange={v=>setForm({...form, group:v})} options={master.groups} placeholder="Group" />
                        <SelectSimple value={form.shift} onChange={v=>setForm({...form, shift:v})} options={master.shifts} placeholder="Shift" />
                    </div>
                    <SelectSimple value={form.line} onChange={v=>setForm({...form, line:v})} options={master.lines} placeholder="Select Line (Mesin)" />
                </div>

                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg space-y-3 border border-neutral-100 dark:border-neutral-800">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase flex items-center gap-1"><Icons.Activity /> Hasil Ukur</label>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <input type="number" placeholder="0" className="p-2 w-full text-lg font-bold text-center bg-white dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-700 outline-none focus:border-blue-500 dark:text-white" 
                                value={form.suhu} onChange={e=>setForm({...form, suhu:e.target.value})} required/>
                            <div className="text-center text-[10px] text-neutral-400 mt-1">SUHU (°C)</div>
                        </div>
                        <div>
                            <input type="number" step="0.01" placeholder="0.00" className="p-2 w-full text-lg font-bold text-center bg-white dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-700 outline-none focus:border-green-500 dark:text-white" 
                                value={form.berat} onChange={e=>setForm({...form, berat:e.target.value})} required/>
                            <div className="text-center text-[10px] text-neutral-400 mt-1">BERAT (kg)</div>
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg space-y-3 border border-neutral-100 dark:border-neutral-800">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase flex items-center gap-1"><Icons.CheckCircle /> Keputusan QC</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={()=>setForm({...form, kualitas:'OK'})}
                            className={`p-3 rounded-lg font-bold text-sm transition-all border ${form.kualitas==='OK' ? 'bg-green-500 text-white border-green-600 shadow-md' : 'bg-white dark:bg-neutral-800 text-neutral-400 border-transparent hover:border-neutral-200'}`}>
                            OK (PASS)
                        </button>
                        <button type="button" onClick={()=>setForm({...form, kualitas:'NOT OK'})}
                            className={`p-3 rounded-lg font-bold text-sm transition-all border ${form.kualitas==='NOT OK' ? 'bg-red-500 text-white border-red-600 shadow-md' : 'bg-white dark:bg-neutral-800 text-neutral-400 border-transparent hover:border-neutral-200'}`}>
                            REJECT
                        </button>
                    </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2">
                    <Icons.Box /> KIRIM DATA
                </button>
            </form>
        </div>
    </div>
  );
};