import { SelectFilter } from '@/components/UIComponents';

export const FilterSection = ({ filters, setFilters, lines, shifts }) => {
  return (
    <section className="bg-white dark:bg-neutral-900 p-5 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row gap-4 items-end">
      <div className="flex flex-wrap gap-4 w-full">
        <div>
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1 block">Start Date</label>
          <input 
            type="date" 
            className="appearance-none w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 outline-none focus:border-blue-500 cursor-pointer dark:text-white"
            value={filters.startDate} 
            onChange={e => setFilters({...filters, startDate: e.target.value})} 
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1 block">End Date</label>
          <input 
            type="date" 
            className="appearance-none w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 outline-none focus:border-blue-500 cursor-pointer dark:text-white"
            value={filters.endDate} 
            onChange={e => setFilters({...filters, endDate: e.target.value})} 
          />
        </div>
        
        <div className="w-[1px] h-8 bg-neutral-200 dark:bg-neutral-700 mx-2 hidden md:block self-end mb-1"></div>

        <SelectFilter value={filters.line} onChange={v=>setFilters({...filters, line:v})} placeholder="All Lines" options={lines} label="Line" />
        <SelectFilter value={filters.shift} onChange={v=>setFilters({...filters, shift:v})} placeholder="All Shifts" options={shifts} label="Shift" />
        <SelectFilter value={filters.status} onChange={v=>setFilters({...filters, status:v})} placeholder="All Status" options={['OK', 'NOT OK']} label="Status" />

        <button 
          onClick={() => setFilters({startDate:'', endDate:'', line:'', shift:'', status:''})} 
          className="text-xs text-red-500 font-bold bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 px-4 py-2.5 rounded ml-auto transition border border-red-100 dark:border-red-900/30"
        >
          RESET FILTER
        </button>
      </div>
    </section>
  );
};