import { motion } from 'framer-motion';
import { Sprout, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Crop } from '@/types/garden';

const statusBadge: Record<string, string> = {
  planted: 'bg-water text-water-foreground',
  growing: 'bg-primary text-primary-foreground',
  ready: 'bg-harvest-gold text-harvest-gold-foreground',
  harvested: 'bg-accent text-accent-foreground',
};

interface CropCardProps {
  crop: Crop;
  index: number;
  onSelect: (crop: Crop) => void;
  onRemove: (id: string) => void;
}

const CropCard = ({ crop, index, onSelect, onRemove }: CropCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="stat-card group cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all"
      onClick={() => onSelect(crop)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {crop.imageUrl ? (
            <img
              src={crop.imageUrl}
              alt={crop.name}
              className="h-10 w-10 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg garden-gradient text-primary-foreground font-bold">
              <Sprout className="h-5 w-5" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-foreground">{crop.name}</h3>
            <p className="text-xs text-muted-foreground">{crop.variety}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusBadge[crop.status]}>{crop.status}</Badge>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(crop.id); }}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CropCard;
