"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  const [master, setMaster] = useState({ groups: [], shifts: [], lines: [] });
  const [chartData, setChartData] = useState([]);
  
  const [filters, setFilters] = useState({
    line: '',
    shift: '',
    status: ''
  });

  const [form, setForm] = useState({
    group: '', shift: '', line: '', suhu: '', berat: '', kualitas: 'OK'
  });

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchMaster();
    fetchData();

    const intervalId = setInterval(() => {
        fetchData();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const getFilteredData = () => {
    return chartData.filter(item => {
        const matchLine = filters.line === '' || item.line === filters.line;
        const matchShift = filters.shift === '' || item.shift.toString() === filters.shift; 
        const matchStatus = filters.status === '' || item.kualitas === filters.status;
        
        return matchLine && matchShift && matchStatus;
    });
  };

  const finalData = getFilteredData();

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const fetchMaster = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/master');
      setMaster(res.data);
    } catch (err) {
      setMaster({
        groups: ['SD', 'SMP', 'SMA', 'Mahasiswa'],
        shifts: [1, 2, 3],
        lines: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
      });
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/data');
      setChartData(res.data);
    } catch (err) { console.error("Error fetching data"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.group || !form.shift || !form.line || !form.suhu || !form.berat) {
      showToast("Harap lengkapi semua data!", "error");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/data', form);
      
      showToast("Data Berhasil Disimpan!", "success");
      
      fetchData();
      setForm({...form, suhu: '', berat: ''}); 
    } catch (err) { 
        showToast("Gagal menyimpan data", "error"); 
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload; 
      const isOk = data.kualitas === 'OK';

      return (
        <div className="bg-white dark:bg-neutral-800 p-4 border border-neutral-200 dark:border-neutral-700 shadow-xl rounded-lg z-50">
          <div className="flex justify-between items-center border-b pb-2 mb-2 border-neutral-200 dark:border-neutral-600">
             <span className="font-bold text-lg text-neutral-800 dark:text-neutral-100">Line: {data.line}</span>
             <span className="text-xs text-neutral-500 font-mono">#{data.id}</span>
          </div>
          
          <div className="space-y-1 mb-3">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Suhu: <span className="text-neutral-600 dark:text-neutral-300">{data.suhu}°C</span>
            </p>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Berat: <span className="text-neutral-600 dark:text-neutral-300">{data.berat} kg</span>
            </p>
            <p className="text-xs text-neutral-400 mt-1">
                {data.group} • Shift {data.shift}
            </p>
          </div>
          
          <div className={`py-1 px-2 rounded text-center text-sm font-bold border ${isOk ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
             {isOk ? "STATUS: OK (PASS)" : "STATUS: NOT OK (REJECT)"}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen w-full font-sans transition-colors duration-300 bg-white text-neutral-900 dark:bg-black dark:text-neutral-100 flex flex-col relative">

      <div className={`fixed bottom-5 right-5 z-[100] transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center px-6 py-4 rounded-lg shadow-2xl border ${
            toast.type === 'success' 
            ? 'bg-white border-green-500 text-green-700 dark:bg-neutral-900 dark:text-green-400' 
            : 'bg-white border-red-500 text-red-700 dark:bg-neutral-900 dark:text-red-400'
        }`}>
            <div className={`mr-3 text-2xl`}>
                {toast.type === 'success' ? '✅' : '⚠️'}
            </div>
            <div>
                <h4 className="font-bold text-sm uppercase">{toast.type === 'success' ? 'Sukses' : 'Error'}</h4>
                <p className="text-sm font-medium">{toast.message}</p>
            </div>
        </div>
      </div>


      <header className="px-8 py-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-white dark:bg-black">
        <h1 className="text-2xl font-bold tracking-tight">
          MBKM<span className="text-blue-600 dark:text-blue-500">Project</span>
        </h1>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-0 lg:divide-x divide-neutral-200 dark:divide-neutral-800">
        
        <section className="lg:col-span-2 p-6 flex flex-col bg-neutral-50 dark:bg-[#0a0a0a]">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-lg font-semibold opacity-70">Live Monitoring</h2>
            
            <div className="flex gap-2">
                <select 
                    className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.line}
                    onChange={(e) => setFilters({...filters, line: e.target.value})}
                >
                    <option value="">All Lines</option>
                    {master.lines.map(l => <option key={l} value={l}>Line {l}</option>)}
                </select>

                <select 
                    className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.shift}
                    onChange={(e) => setFilters({...filters, shift: e.target.value})}
                >
                    <option value="">All Shifts</option>
                    {master.shifts.map(s => <option key={s} value={s}>Shift {s}</option>)}
                </select>

                <select 
                    className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                    <option value="">All Status</option>
                    <option value="OK">✅ OK Only</option>
                    <option value="NOT OK">❌ Reject Only</option>
                </select>
                
                {(filters.line || filters.shift || filters.status) && (
                    <button 
                        onClick={() => setFilters({line:'', shift:'', status:''})}
                        className="text-xs text-red-500 hover:text-red-700 font-bold px-2"
                    >
                        Reset
                    </button>
                )}
            </div>
          </div>
          
          <div className="h-[450px] w-full relative">
            {finalData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={finalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                    <XAxis 
                        dataKey="id" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#888', fontSize: 12}}
                        tickFormatter={(value) => {
                            const item = finalData.find(d => d.id === value);
                            return item ? item.line : value;
                        }}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.1)'}} />
                    <Bar dataKey="suhu" name="Suhu (°C)" radius={[4, 4, 0, 0]} barSize={40}>
                        { finalData.map((entry, index) => (
                            <Cell key={`cell-s-${index}`} fill={entry.kualitas === 'NOT OK' ? '#dc2626' : '#3b82f6'} />
                        ))}
                    </Bar>
                    <Bar dataKey="berat" name="Berat (kg)" radius={[4, 4, 0, 0]} barSize={40}>
                        { finalData.map((entry, index) => (
                            <Cell key={`cell-b-${index}`} fill={entry.kualitas === 'NOT OK' ? '#b91c1c' : '#10b981'} />
                        ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
                    <div className="text-4xl mb-2">🔍</div>
                    <p>No data found matching filters</p>
                </div>
            )}
          </div>
        </section>

        <section className="p-8 flex flex-col justify-center bg-white dark:bg-black">
          <h2 className="text-xl font-bold mb-6">Input Data</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-50">Group & Shift</label>
                <div className="grid grid-cols-2 gap-3">
                    <SelectSimple 
                        value={form.group} 
                        onChange={v => setForm({...form, group: v})} 
                        options={master.groups} 
                        placeholder="Group" 
                        required={true}
                    />
                    <SelectSimple 
                        value={form.shift} 
                        onChange={v => setForm({...form, shift: v})} 
                        options={master.shifts} 
                        placeholder="Shift" 
                        required={true}
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-50">Production Line</label>
                <SelectSimple 
                    value={form.line} 
                    onChange={v => setForm({...form, line: v})} 
                    options={master.lines} 
                    placeholder="Select Line (A-M)" 
                    required={true}
                />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-50">Measurements</label>
                <div className="grid grid-cols-2 gap-3">
                    <InputSimple 
                        type="number" 
                        placeholder="Suhu" 
                        value={form.suhu}
                        onChange={v => setForm({...form, suhu: v})}
                        required={true}
                    />
                    <InputSimple 
                        type="number" 
                        step="0.01"
                        placeholder="Berat" 
                        value={form.berat}
                        onChange={v => setForm({...form, berat: v})}
                        required={true}
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-50">QC Result</label>
                <div className="relative">
                    <select 
                        className={`w-full border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 appearance-none
                                    ${form.kualitas === 'NOT OK' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'}`}
                        value={form.kualitas}
                        onChange={(e) => setForm({...form, kualitas: e.target.value})}
                    >
                        <option value="OK" className="bg-white text-black dark:bg-black dark:text-white">
                            OK (Pass)
                        </option>
                        <option value="NOT OK" className="bg-white text-black dark:bg-black dark:text-white">
                            NOT OK (Reject)
                        </option>
                    </select>
                </div>
            </div>

            <button className={`w-full mt-4 font-bold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl text-white
                ${form.kualitas === 'NOT OK' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {form.kualitas === 'NOT OK' ? 'Submit REJECT Data' : 'Submit OK Data'}
            </button>
          </form>
        </section>

      </main>
    </div>
  );
}

function SelectSimple({ value, onChange, options, placeholder, required }) {
    return (
        <select 
            required={required}
            className="w-full bg-neutral-100 dark:bg-neutral-900 border border-transparent rounded-lg p-3 text-sm transition-all outline-none
                       focus:ring-1 focus:ring-gray-400 focus:border-gray-400 
                       dark:focus:ring-neutral-600 dark:focus:border-neutral-600
                       text-neutral-900 dark:text-white placeholder-neutral-400"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">{placeholder}</option>
            {options.map(o => (
                <option key={o} value={o} className="bg-white text-black dark:bg-black dark:text-white">
                    {o}
                </option>
            ))}
        </select>
    )
}

function InputSimple({ type, placeholder, value, onChange, step, required }) {
    return (
        <input 
            required={required}
            type={type}
            step={step}
            placeholder={placeholder}
            className="w-full bg-neutral-100 dark:bg-neutral-900 border border-transparent rounded-lg p-3 text-sm transition-all outline-none
                       focus:ring-1 focus:ring-gray-400 focus:border-gray-400 
                       dark:focus:ring-neutral-600 dark:focus:border-neutral-600
                       text-neutral-900 dark:text-white placeholder-neutral-400"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    )
}