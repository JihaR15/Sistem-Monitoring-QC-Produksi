import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Icons } from '@/components/Icons';

export const ChartSection = ({ pieData, chartDataDisplay, chartType, setChartType }) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-100 dark:border-neutral-800 flex flex-col items-center justify-between shadow-md">
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
                       <Tooltip contentStyle={{backgroundColor: 'var(--background, #fff)', color: 'var(--foreground, #000)', borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
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

      <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-md">
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
                           <Tooltip contentStyle={{backgroundColor: 'var(--background, #fff)', color: 'var(--foreground, #000)', borderRadius:'8px', border:'none', boxShadow:'0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                           
                           <Area type="monotone" dataKey="suhu" stroke="#3b82f6" strokeWidth={3} fill="url(#gradSuhu)" dot={{r: 3, fill: '#3b82f6', strokeWidth:0}} activeDot={{r: 6}} isAnimationActive={true} />
                          <Area type="monotone" dataKey="berat" stroke="#10b981" strokeWidth={3} fill="url(#gradBerat)" dot={{r: 3, fill: '#10b981', strokeWidth:0}} activeDot={{r: 6}} isAnimationActive={true} />
                      </AreaChart>
                  ) : (
                      <BarChart data={chartDataDisplay}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                           <XAxis dataKey="line" tick={{fontSize:12, fill:'#888'}} axisLine={false} tickLine={false} />
                           <YAxis domain={[0, 'auto']} tick={{fontSize:12, fill:'#888'}} axisLine={false} tickLine={false} />
                           <Tooltip contentStyle={{backgroundColor: 'var(--background, #fff)', color: 'var(--foreground, #000)', borderRadius:'8px', border:'none', boxShadow:'0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                           <Bar dataKey="suhu" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="berat" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                  )}
              </ResponsiveContainer>
          </div>
      </div>
    </section>
  );
};