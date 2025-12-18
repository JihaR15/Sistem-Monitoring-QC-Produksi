"use client";
import { useState, useEffect } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const Icons = {
  Help: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>,
  Box: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  CheckCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  AlertTriangle: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Activity: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Close: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Filter: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Chart: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Wave: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  SortUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>,
  SortDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
};

const STANDARDS = {
    minSuhu: 12,
    maxSuhu: 20,
    minBerat: 12.5,
    maxBerat: 18.5
};

export default function Home() {
  const [master, setMaster] = useState({ groups: [], shifts: [], lines: [] });
  const [chartData, setChartData] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', line: '', shift: '', status: '' });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [chartType, setChartType] = useState('area'); 
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });

  const [form, setForm] = useState({
    group: '', shift: '', line: '', suhu: '', berat: '', kualitas: 'OK'
  });

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const checkTheme = () => {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    checkTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkTheme);
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', checkTheme);
    };
  }, []);

  useEffect(() => {
    fetchMaster();
    fetchData();
    const intervalId = setInterval(() => fetchData(), 3000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (form.suhu && form.berat) {
        const temp = parseInt(form.suhu);
        const weight = parseFloat(form.berat);
        
        const isBadTemp = temp < STANDARDS.minSuhu || temp > STANDARDS.maxSuhu;
        const isBadWeight = weight < STANDARDS.minBerat || weight > STANDARDS.maxBerat;

        if (isBadTemp || isBadWeight) {
            setForm(prev => ({ ...prev, kualitas: 'NOT OK' }));
        } else {
            setForm(prev => ({ ...prev, kualitas: 'OK' }));
        }
    }
  }, [form.suhu, form.berat]);

  const getFilteredData = () => {
    return chartData.filter(item => {
        let dateValid = true;
        if (filters.startDate && item.date < filters.startDate) dateValid = false;
        if (filters.endDate && item.date > filters.endDate) dateValid = false;
        const matchLine = filters.line === '' || item.line === filters.line;
        const matchShift = filters.shift === '' || item.shift.toString() === filters.shift; 
        const matchStatus = filters.status === '' || item.kualitas === filters.status;
        return dateValid && matchLine && matchShift && matchStatus;
    });
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const finalData = getFilteredData();
  const chartDataDisplay = finalData.slice(-15); 

  const sortedData = [...finalData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalProduksi = finalData.length;
  const totalReject = finalData.filter(i => i.kualitas === 'NOT OK').length;
  const totalOK = totalProduksi - totalReject;
  const rejectRate = totalProduksi > 0 ? ((totalReject / totalProduksi) * 100).toFixed(1) : 0;

  const pieData = [
    { name: 'OK', value: totalOK, color: '#10b981' },
    { name: 'Not OK', value: totalReject, color: '#ef4444' },
  ];

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const fetchMaster = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/master');
      const data = await res.json();
      setMaster(data);
    } catch (err) { }
  };

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/data');
      const data = await res.json();
      setChartData(data);
    } catch (err) { console.error("Error fetching data"); }
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (!form.group || !form.shift || !form.line || !form.suhu || !form.berat) {
      showToast("Mohon lengkapi semua data!", "error"); return;
    }
    if (parseInt(form.suhu) < 0 || parseFloat(form.berat) < 0) {
        showToast("Angka tidak boleh negatif!", "error"); return;
    }
    setShowConfirm(true);
  };

  const handleFinalSubmit = async () => {
    setShowConfirm(false); 
    try {
      await fetch('http://localhost:5000/api/data', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      });
      showToast("Data Berhasil Disimpan!", "success");
      fetchData(); 
      setForm({...form, suhu: '', berat: ''}); 
    } catch (err) { showToast("Gagal menyimpan data", "error"); }
  };

  const SortIcon = ({ colKey }) => {
    if (sortConfig.key !== colKey) return <span className="opacity-20 ml-1">⇅</span>;
    return sortConfig.direction === 'asc' ? <span className="ml-1 text-blue-500"><Icons.SortUp/></span> : <span className="ml-1 text-blue-500"><Icons.SortDown/></span>;
  };

  return (
    <div className="min-h-screen w-full bg-neutral-50 dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans pb-20 transition-colors duration-300">
        
        <div className={`fixed top-5 right-5 z-50 transition-all ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5 pointer-events-none'}`}>
            <div className={`px-4 py-3 rounded-lg shadow-xl text-white font-bold flex items-center gap-2 ${toast.type==='success'?'bg-green-600':'bg-red-600'}`}>
                {toast.type==='success' ? <Icons.CheckCircle /> : <Icons.AlertTriangle />}
                <span>{toast.message}</span>
            </div>
        </div>

        <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 sticky top-0 z-40 flex justify-between items-center shadow-sm">
            <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                    🏭 Production <span className="text-blue-600">Dashboard</span>
                </h1>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">Sistem Monitoring Kualitas Real-time</div>
            </div>
            
            <div className="flex items-center gap-3">
                <button onClick={() => setShowGuide(true)} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors" title="Bantuan">
                    <Icons.Help />
                </button>
            </div>
        </header>

        <main className="p-6 max-w-7xl mx-auto space-y-6">
            
            <section className="bg-white dark:bg-neutral-900 p-5 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex flex-wrap gap-4 w-full">
                    <div>
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1 block">Start Date</label>
                        <input type="date" className="appearance-none w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 outline-none focus:border-blue-500 cursor-pointer dark:text-white"
                            value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1 block">End Date</label>
                        <input type="date" className="appearance-none w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 outline-none focus:border-blue-500 cursor-pointer dark:text-white"
                            value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} />
                    </div>
                    
                    <div className="w-[1px] h-8 bg-neutral-200 dark:bg-neutral-700 mx-2 hidden md:block self-end mb-1"></div>

                    <SelectFilter value={filters.line} onChange={v=>setFilters({...filters, line:v})} placeholder="All Lines" options={master.lines} label="Line" />
                    <SelectFilter value={filters.shift} onChange={v=>setFilters({...filters, shift:v})} placeholder="All Shifts" options={master.shifts} label="Shift" />
                    <SelectFilter value={filters.status} onChange={v=>setFilters({...filters, status:v})} placeholder="All Status" options={['OK', 'NOT OK']} label="Status" />

                    <button onClick={() => setFilters({startDate:'', endDate:'', line:'', shift:'', status:''})} 
                        className="text-xs text-red-500 font-bold bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 px-4 py-2.5 rounded ml-auto transition border border-red-100 dark:border-red-900/30">
                        RESET FILTER
                    </button>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="TOTAL PRODUKSI" value={totalProduksi} icon={<Icons.Box />} />
                <StatCard title="PRODUK OK" value={totalOK} color="text-green-600" icon={<Icons.CheckCircle />} />
                <StatCard title="PRODUK NOT OK" value={totalReject} color="text-red-600" icon={<Icons.AlertTriangle />} />
                <StatCard title="NOT OK RATE" value={`${rejectRate}%`} color={rejectRate > 5 ? "text-red-500" : "text-green-500"} icon={<Icons.Activity />} />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-100 dark:border-neutral-800 flex flex-col items-center justify-between shadow-sm">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest w-full text-center mb-2">Rasio Kualitas</h3>
                    
                    <div className="h-[220px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <defs>
                                  <linearGradient id="gradOK" x1="0" x2="1">
                                      <stop offset="0%" stopColor="#34d399" stopOpacity="0.95"/>
                                      <stop offset="100%" stopColor="#10b981" stopOpacity={1} />
                                  </linearGradient>
                                  <linearGradient id="gradNotOK" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#f87171" stopOpacity={1} />
                                      <stop offset="100%" stopColor="#ef4444" stopOpacity={1} />
                                  </linearGradient>
                              </defs>
                                <Pie data={pieData} innerRadius={50} outerRadius={80} paddingAngle={0} dataKey="value">
                                    {pieData.map((entry, index) => {
                                        const id = entry.name === 'OK' ? 'gradOK' : 'gradNotOK';
                                        return <Cell key={`cell-${index}`} fill={`url(#${id})`} stroke="none" />;
                                    })}
                                </Pie>
                                <Tooltip contentStyle={{backgroundColor: 'var(--tooltip-bg, #fff)', borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex justify-center gap-6 mt-2 pb-2">
                        {pieData.map((d, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                                <span className="w-3 h-3 rounded-full" style={{ background: d.name === 'OK' ? '#10b981' : '#ef4444' }} />
                                <span className="font-bold text-neutral-700 dark:text-neutral-300">{d.name} ({d.value})</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Tren Pengukuran</h3>
                            <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded p-1">
                                <button onClick={()=>setChartType('area')} className={`px-2 py-1 rounded text-xs transition-colors ${chartType==='area' ? 'bg-white dark:bg-neutral-700 shadow text-black dark:text-white' : 'text-neutral-400'}`}><Icons.Wave /></button>
                                <button onClick={()=>setChartType('bar')} className={`px-2 py-1 rounded text-xs transition-colors ${chartType==='bar' ? 'bg-white dark:bg-neutral-700 shadow text-black dark:text-white' : 'text-neutral-400'}`}><Icons.Chart /></button>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-blue-600 block" />
                              <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">SUHU (°C)</span>
                          </div>
                          <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-green-600 block" />
                              <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">BERAT (kg)</span>
                          </div>
                        </div>
                    </div>
                    
                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            {chartType === 'area' ? (
                                <AreaChart data={chartDataDisplay}>
                                    <defs>
                                        <linearGradient id="gradSuhu" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="gradBerat" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                    <XAxis dataKey="line" tick={{fontSize:12, fill:'#888'}} axisLine={false} tickLine={false} />
                                    <YAxis domain={['auto', 'auto']} tick={{fontSize:12, fill:'#888'}} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{backgroundColor: '#fff', color: '#000', borderRadius:'8px', border:'none', boxShadow:'0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                                    
                                    <Area type="monotone" dataKey="suhu" stroke="#3b82f6" strokeWidth={3} fill="url(#gradSuhu)" dot={{r: 3, fill: '#3b82f6', strokeWidth:0}} activeDot={{r: 6}} isAnimationActive={true} />
                                    <Area type="monotone" dataKey="berat" stroke="#10b981" strokeWidth={3} fill="url(#gradBerat)" dot={{r: 3, fill: '#10b981', strokeWidth:0}} activeDot={{r: 6}} isAnimationActive={true} />
                                </AreaChart>
                            ) : (
                                <BarChart data={chartDataDisplay}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                    <XAxis dataKey="line" tick={{fontSize:12, fill:'#888'}} axisLine={false} tickLine={false} />
                                    <YAxis domain={[0, 'auto']} tick={{fontSize:12, fill:'#888'}} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{backgroundColor: '#fff', color: '#000', borderRadius:'8px', border:'none', boxShadow:'0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                                    <Bar dataKey="suhu" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="berat" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-100 dark:border-neutral-800 flex flex-col shadow-sm h-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Log Data Produksi</h3>
                        <span className="text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">Total: {finalData.length}</span>
                    </div>
                    
                    <div className="rounded-lg border border-neutral-100 dark:border-neutral-800 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 dark:bg-neutral-800 select-none">
                                <tr>
                                    <th className="px-4 py-3 font-semibold cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition" onClick={() => requestSort('date')}>
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
                                    <tr><td colSpan={6} className="text-center py-10 text-neutral-400">Belum ada data</td></tr>
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

            </section>
        </main>

        {showGuide && (
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
        )}

        {showConfirm && (
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
        )}

    </div>
  );
}

const StatCard = ({ title, value, color="text-neutral-900 dark:text-white", icon }) => (
    <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex items-center gap-4 hover:border-blue-300 transition-colors group">
        <div className="text-3xl bg-neutral-50 dark:bg-neutral-800 w-12 h-12 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">{icon}</div>
        <div>
            <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{title}</h4>
            <div className={`text-2xl font-black ${color}`}>{value}</div>
        </div>
    </div>
);

const SelectFilter = ({ value, onChange, options, placeholder, label }) => (
    <div className="w-full md:w-auto">
        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1 block">{label}</label>
        <div className="relative">
            <select className="appearance-none w-full p-2.5 pr-8 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 outline-none focus:border-blue-500 cursor-pointer dark:text-white"
                value={value} onChange={e => onChange(e.target.value)}>
                <option value="">{placeholder}</option>
                {options.map(o => <option key={o} value={o} className="dark:bg-neutral-800">{o}</option>)}
            </select>
            <div className="absolute right-2 top-3 text-neutral-400 pointer-events-none transform scale-75">▼</div>
        </div>
    </div>
);

const SelectSimple = ({ value, onChange, options, placeholder }) => (
    <div className="relative">
        <select className="appearance-none w-full p-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors dark:text-white"
            value={value} onChange={e => onChange(e.target.value)} required>
            <option value="">- {placeholder} -</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <div className="absolute right-3 top-3 text-neutral-400 pointer-events-none transform scale-75">▼</div>
    </div>
);