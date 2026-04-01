import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, MapPin, ImageIcon } from 'lucide-react';
import { useGarden } from '@/context/GardenContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Location } from '@/types/garden';
import { compressImageToBase64 } from '@/lib/imageUtils';

const Locations = () => {
  const { locations, spaces, addLocation, removeLocation } = useGarden();
  const [open, setOpen] = useState(false);
  const [detailLocation, setDetailLocation] = useState<Location | null>(null);
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressImageToBase64(file);
      setImageUrl(base64);
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    addLocation({
      id: Date.now().toString(),
      name: name.trim(),
      size: size.trim(),
      imageUrl: imageUrl || undefined,
      createdAt: new Date().toISOString().split('T')[0],
    });
    setName('');
    setSize('');
    setImageUrl('');
    setOpen(false);
  };

  const spacesForLocation = (locId: string) => spaces.filter(s => s.locationId === locId);

  const spaceTypeIcons: Record<string, string> = {
    'raised-bed': '🌱',
    'greenhouse': '🏡',
    'plot': '🌾',
    'container': '🪴',
    'indoor': '🏠',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Locations</h1>
          <p className="mt-1 text-muted-foreground">Manage your growing locations</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Location</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Location</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input placeholder="Location name" value={name} onChange={e => setName(e.target.value)} />
              <Input placeholder="Size (e.g., 2 hectares)" value={size} onChange={e => setSize(e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Location Image</label>
                {imageUrl && (
                  <img src={imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg mb-2" />
                )}
                <Input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
              <Button onClick={handleAdd} className="w-full">Create Location</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {locations.map((loc, i) => {
          const spaceCount = spacesForLocation(loc.id).length;
          return (
            <motion.div
              key={loc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="stat-card group cursor-pointer"
              onClick={() => setDetailLocation(loc)}
            >
              {loc.imageUrl ? (
                <img src={loc.imageUrl} alt={loc.name} className="w-full h-32 object-cover rounded-lg mb-3" />
              ) : (
                <div className="w-full h-32 rounded-lg mb-3 bg-muted flex items-center justify-center">
                  <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
                </div>
              )}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-foreground">{loc.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {loc.size}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeLocation(loc.id); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm font-medium text-primary">{spaceCount} spaces</span>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!detailLocation} onOpenChange={(v) => !v && setDetailLocation(null)}>
        <DialogContent className="max-w-lg">
          {detailLocation && (
            <>
              <DialogHeader>
                <DialogTitle>{detailLocation.name}</DialogTitle>
              </DialogHeader>
              {detailLocation.imageUrl && (
                <img src={detailLocation.imageUrl} alt={detailLocation.name} className="w-full h-48 object-cover rounded-lg" />
              )}
              <div className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                <MapPin className="h-3 w-3" /> {detailLocation.size}
              </div>
              <h4 className="font-semibold text-foreground mb-2">Spaces in this location</h4>
              {spacesForLocation(detailLocation.id).length === 0 ? (
                <p className="text-sm text-muted-foreground">No spaces added yet.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {spacesForLocation(detailLocation.id).map(space => (
                    <div key={space.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <span className="text-xl">{spaceTypeIcons[space.type] || '🌿'}</span>
                      <div>
                        <p className="font-medium text-foreground text-sm">{space.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{space.type.replace('-', ' ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Locations;
