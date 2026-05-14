"use client";
import { useState, useEffect } from 'react';
import { Icons } from '@/components/Icons';
import { STANDARDS } from '@/constants/config';
import { useApi } from "@/hooks/useApi";

// Dashboard Components
import { FilterSection } from '@/components/Dashboard/FilterSection';
import { StatSection } from '@/components/Dashboard/StatSection';
import { ChartSection } from '@/components/Dashboard/ChartSection';
import { TableSection } from '@/components/Dashboard/TableSection';
import { FormSection } from '@/components/Dashboard/FormSection';
import { GuideModal, ConfirmModal } from '@/components/Dashboard/Modals';

export default function Home() {
  const { master, chartData, loading, error, fetchData, postData } = useApi();

  const [showGuide, setShowGuide] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', line: '', shift: '', status: '' });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

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
    const { success } = await postData(form);
    if (success) {
      showToast("Data Berhasil Disimpan!", "success");
      setForm({...form, suhu: '', berat: ''}); 
    } else {
      showToast("Gagal menyimpan data", "error");
    }
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
                    <Icons.Factory />Production <span className="text-blue-600">Dashboard</span>
                </h1>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">Sistem Monitoring Kualitas Real-time</div>
            </div>
            
            <div className="flex items-center gap-3">
                <button onClick={() => setShowGuide(true)} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors" title="Bantuan">
                    <Icons.Help />
                </button>
            </div>
        </header>

        <main className="p-6 w-full mx-auto space-y-6">
            <FilterSection filters={filters} setFilters={setFilters} lines={master.lines} shifts={master.shifts} />
            <StatSection totalProduksi={totalProduksi} totalOK={totalOK} totalReject={totalReject} rejectRate={rejectRate} />
            <ChartSection pieData={pieData} chartDataDisplay={chartDataDisplay} chartType={chartType} setChartType={setChartType} />

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <TableSection 
                    paginatedData={paginatedData} 
                    finalDataLength={finalData.length} 
                    sortConfig={sortConfig} 
                    requestSort={requestSort} 
                    setCurrentPage={setCurrentPage} 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                />
            <FormSection form={form} setForm={setForm} handlePreSubmit={handlePreSubmit} master={master} />
            </section>
        </main>

        {showGuide && <GuideModal setShowGuide={setShowGuide} />}
        {showConfirm && <ConfirmModal form={form} setShowConfirm={setShowConfirm} handleFinalSubmit={handleFinalSubmit} />}

    </div>
  );
}

