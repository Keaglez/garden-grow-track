import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Trash2 } from 'lucide-react';
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
  const { spaces, crops, addSpace, removeSpace } = useGarden();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState('');
  const [type, setType] = useState<GardenSpace['type']>('plot');

  const handleAdd = () => {
    if (!name.trim()) return;
    addSpace({
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      size: size.trim(),
      type,
      createdAt: new Date().toISOString().split('T')[0],
    });
    setName('');
    setDescription('');
    setSize('');
    setType('plot');
    setOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Garden Spaces</h1>
          <p className="mt-1 text-muted-foreground">Manage your growing areas</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Space
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Garden Space</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input placeholder="Space name" value={name} onChange={e => setName(e.target.value)} />
              <Input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
              <Input placeholder="Size (e.g., 10x20 ft)" value={size} onChange={e => setSize(e.target.value)} />
              <Select value={type} onValueChange={(v) => setType(v as GardenSpace['type'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
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
              <p className="text-sm text-muted-foreground mb-3">{space.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {space.size}
                </span>
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
