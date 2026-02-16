import { Sprout } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { Crop, GardenSpace } from '@/types/garden';

const statusBadge: Record<string, string> = {
  planted: 'bg-water text-water-foreground',
  growing: 'bg-primary text-primary-foreground',
  ready: 'bg-harvest-gold text-harvest-gold-foreground',
  harvested: 'bg-accent text-accent-foreground',
};

interface CropDetailDialogProps {
  crop: Crop | null;
  space?: GardenSpace;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CropDetailDialog = ({ crop, space, open, onOpenChange }: CropDetailDialogProps) => {
  if (!crop) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-primary" />
            {crop.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {crop.imageUrl && (
            <img
              src={crop.imageUrl}
              alt={crop.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge className={statusBadge[crop.status]}>{crop.status}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Variety</p>
              <p className="font-medium text-foreground">{crop.variety || '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Space</p>
              <p className="font-medium text-foreground">{space?.name || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Planted</p>
              <p className="font-medium text-foreground">{crop.plantedDate || '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Expected Harvest</p>
              <p className="font-medium text-foreground">{crop.expectedHarvest || '—'}</p>
            </div>
          </div>
          {crop.notes && (
            <div>
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="text-sm text-foreground italic">{crop.notes}</p>
            </div>
          )}
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground font-mono">QR: {crop.qrData}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CropDetailDialog;
