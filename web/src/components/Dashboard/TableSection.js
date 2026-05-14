import { Icons } from '@/components/Icons';

export const TableSection = ({ paginatedData, finalDataLength, sortConfig, requestSort, setCurrentPage, currentPage, totalPages }) => {
  const SortIcon = ({ colKey }) => {
    if (sortConfig.key !== colKey) return <span className="opacity-20 ml-1">⇅</span>;
    return sortConfig.direction === 'asc' ? <span className="ml-1 text-blue-500"><Icons.SortUp/></span> : <span className="ml-1 text-blue-500"><Icons.SortDown/></span>;
  };

  return (
    <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-100 dark:border-neutral-800 flex flex-col shadow-sm h-auto">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Log Data Produksi</h3>
            <span className="text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">Total: {finalDataLength}</span>
        </div>
        
        <div className="rounded-lg border border-neutral-100 dark:border-neutral-800 overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 dark:bg-neutral-800 select-none">
                    <tr>
                        <th className="px-4 py-3 font-semibold cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition" onClick={() => requestSort('id')}>
                            <div className="flex items-center">No <SortIcon colKey="id"/></div>
                        </th>
                        <th className="px-4 py-3 font-semibold cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition" onClick={() => requestSort('date')}>
                            <div className="flex items-center">Date <SortIcon colKey="date"/></div>
                        </th>
                        <th className="px-4 py-3 font-semibold cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition" onClick={() => requestSort('shift')}>
                            <div className="flex items-center">Shift <SortIcon colKey="shift"/></div>
                        </th>
                        <th className="px-4 py-3 font-semibold cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition" onClick={() => requestSort('line')}>
                            <div className="flex items-center">Line <SortIcon colKey="line"/></div>
                        </th>
                        <th className="px-4 py-3 text-right font-semibold cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition" onClick={() => requestSort('suhu')}>
                            <div className="flex items-center justify-end">Suhu <SortIcon colKey="suhu"/></div>
                        </th>
                        <th className="px-4 py-3 text-right font-semibold cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition" onClick={() => requestSort('berat')}>
                            <div className="flex items-center justify-end">Berat <SortIcon colKey="berat"/></div>
                        </th>
                        <th className="px-4 py-3 text-center font-semibold cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition" onClick={() => requestSort('kualitas')}>
                            <div className="flex items-center justify-center">Status <SortIcon colKey="kualitas"/></div>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {paginatedData.map((row, i) => (
                        <tr key={i} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition duration-150">
                            <td className="px-4 py-3 text-xs text-neutral-500 font-mono">
                                {row.id.toString()}
                            </td>
                            <td className="px-4 py-3 text-xs text-neutral-500 font-mono">
                                {new Date(row.date).toLocaleString('id-ID', {day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}
                            </td>
                            <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
                                <div className="flex flex-col">
                                    <span className="font-bold text-xs">{row.group}</span>
                                    <span className="text-[10px] text-neutral-400">Shift {row.shift}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3 font-mono font-bold text-neutral-600 dark:text-neutral-400">{row.line}</td>
                            <td className="px-4 py-3 text-right font-medium text-blue-600 dark:text-blue-400">{row.suhu}°C</td>
                            <td className="px-4 py-3 text-right font-medium text-green-600 dark:text-green-400">{row.berat} kg</td>
                            <td className="px-4 py-3 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide border inline-flex items-center gap-1
                                    ${row.kualitas==='OK'
                                        ? 'bg-green-100/50 text-green-700 border-green-200/50 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50'
                                        : 'bg-red-100/50 text-red-700 border-red-200/50 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50'}`}>
                                    {row.kualitas === 'OK' ? <span className="text-[8px]">●</span> : <span className="text-[8px]">▲</span>}
                                    {row.kualitas}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {paginatedData.length === 0 && (
                        <tr><td colSpan={7} className="text-center py-10 text-neutral-400">Belum ada data</td></tr>
                    )}
                </tbody>
            </table>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="px-4 py-2 text-xs font-bold rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-30 transition">
                ◀ Prev
            </button>
            <span className="text-xs font-medium text-neutral-500">Page {currentPage} of {totalPages || 1}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="px-4 py-2 text-xs font-bold rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-30 transition">
                Next ▶
            </button>
        </div>
    </div>
  );
};