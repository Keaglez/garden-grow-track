import { motion } from 'framer-motion';
import { useGarden } from '@/context/GardenContext';

const statusColors: Record<string, string> = {
  planted: 'bg-water',
  growing: 'bg-primary',
  ready: 'bg-harvest-gold',
  harvested: 'bg-accent',
};

const statusLabels: Record<string, string> = {
  planted: 'Planted',
  growing: 'Growing',
  ready: 'Ready',
  harvested: 'Harvested',
};

const CropStatusChart = () => {
  const { crops } = useGarden();
  const counts = crops.reduce((acc, crop) => {
    acc[crop.status] = (acc[crop.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = crops.length || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-xl border bg-card p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Crop Status</h3>
      <div className="flex h-4 rounded-full overflow-hidden bg-muted mb-4">
        {Object.entries(counts).map(([status, count]) => (
          <div
            key={status}
            className={`${statusColors[status]} transition-all duration-500`}
            style={{ width: `${(count / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(statusLabels).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${statusColors[key]}`} />
            <span className="text-sm text-muted-foreground">{label}: <span className="font-semibold text-foreground">{counts[key] || 0}</span></span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CropStatusChart;
