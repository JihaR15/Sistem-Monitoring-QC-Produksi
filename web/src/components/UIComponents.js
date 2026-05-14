import React from 'react';

export const StatCard = ({ title, value, color = "text-neutral-900 dark:text-white", icon }) => (
    <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex items-center gap-4 hover:border-blue-300 transition-colors group">
        <div className="text-3xl bg-neutral-50 dark:bg-neutral-800 w-12 h-12 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">{icon}</div>
        <div>
            <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{title}</h4>
            <div className={`text-2xl font-black ${color}`}>{value}</div>
        </div>
    </div>
);

export const SelectFilter = ({ value, onChange, options, placeholder, label }) => (
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

export const SelectSimple = ({ value, onChange, options, placeholder }) => (
    <div className="relative">
        <select className="appearance-none w-full p-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors dark:text-white"
            value={value} onChange={e => onChange(e.target.value)} required>
            <option value="">- {placeholder} -</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <div className="absolute right-3 top-3 text-neutral-400 pointer-events-none transform scale-75">▼</div>
    </div>
);
