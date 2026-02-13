import { motion } from 'framer-motion';
import { useGarden } from '@/context/GardenContext';
import { Badge } from '@/components/ui/badge';

const qualityColors: Record<string, string> = {
  excellent: 'bg-primary text-primary-foreground',
  good: 'bg-accent text-accent-foreground',
  fair: 'bg-secondary text-secondary-foreground',
  poor: 'bg-destructive text-destructive-foreground',
};

const RecentHarvests = () => {
  const { harvests } = useGarden();
  const recent = harvests.slice(-5).reverse();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-xl border bg-card p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Harvests</h3>
      <div className="space-y-3">
        {recent.map((harvest) => (
          <div key={harvest.id} className="flex items-center justify-between rounded-lg border bg-background p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg garden-gradient text-sm font-bold text-primary-foreground">
                {harvest.cropName[0]}
              </div>
              <div>
                <p className="font-medium text-foreground">{harvest.cropName}</p>
                <p className="text-xs text-muted-foreground">{harvest.spaceName} · {harvest.harvestDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">{harvest.quantity} {harvest.unit}</span>
              <Badge className={qualityColors[harvest.quality]}>{harvest.quality}</Badge>
            </div>
          </div>
        ))}
        {recent.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">No harvests recorded yet</p>
        )}
      </div>
    </motion.div>
  );
};

export default RecentHarvests;
