import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { useGarden } from '@/context/GardenContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { GardenSpace } from '@/types/garden';

const spaceTypeIcons: Record<string, string> = {
  'raised-bed': '🌱',
  'greenhouse': '🏡',
  'plot': '🌾',
  'container': '🪴',
  'indoor': '🏠',
};

const Spaces = () => {
  const { spaces, locations, crops, addSpace, removeSpace } = useGarden();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [locationId, setLocationId] = useState('');
  const [type, setType] = useState<GardenSpace['type']>('plot');

  const handleAdd = () => {
    if (!name.trim() || !locationId) return;
    addSpace({
      id: Date.now().toString(),
      name: name.trim(),
      locationId,
      type,
      createdAt: new Date().toISOString().split('T')[0],
    });
    setName('');
    setLocationId('');
    setType('plot');
    setOpen(false);
  };

  const getLocationName = (locId: string) => locations.find(l => l.id === locId)?.name || 'Unknown';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Garden Spaces</h1>
          <p className="mt-1 text-muted-foreground">Manage your growing areas within locations</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Space</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Garden Space</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Select value={locationId} onValueChange={setLocationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(loc => (
                    <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="Space name" value={name} onChange={e => setName(e.target.value)} />
              <Select value={type} onValueChange={(v) => setType(v as GardenSpace['type'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Space Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plot">Plot</SelectItem>
                  <SelectItem value="raised-bed">Raised Bed</SelectItem>
                  <SelectItem value="greenhouse">Greenhouse</SelectItem>
                  <SelectItem value="container">Container</SelectItem>
                  <SelectItem value="indoor">Indoor</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAdd} className="w-full">Create Space</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {spaces.map((space, i) => {
          const cropCount = crops.filter(c => c.spaceId === space.id).length;
          return (
            <motion.div
              key={space.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="stat-card group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{spaceTypeIcons[space.type]}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{space.name}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{space.type.replace('-', ' ')}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeSpace(space.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">📍 {getLocationName(space.locationId)}</span>
                <span className="font-medium text-primary">{cropCount} crops</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Spaces;
