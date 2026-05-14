import { Icons } from '@/components/Icons';
import { StatCard } from '@/components/UIComponents';

export const StatSection = ({ totalProduksi, totalOK, totalReject, rejectRate }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard title="TOTAL PRODUKSI" value={totalProduksi} icon={<Icons.Box />} />
      <StatCard title="PRODUK OK" value={totalOK} color="text-green-600" icon={<Icons.CheckCircle />} />
      <StatCard title="PRODUK NOT OK" value={totalReject} color="text-red-600" icon={<Icons.AlertTriangle />} />
      <StatCard title="NOT OK RATE" value={`${rejectRate}%`} color={rejectRate > 5 ? "text-red-500" : "text-green-500"} icon={<Icons.Activity />} />
    </section>
  );
};