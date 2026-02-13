import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sprout, Trash2 } from 'lucide-react';
import { useGarden } from '@/context/GardenContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Crop, Harvest } from '@/types/garden';

const statusBadge: Record<string, string> = {
  planted: 'bg-water text-water-foreground',
  growing: 'bg-primary text-primary-foreground',
  ready: 'bg-harvest-gold text-harvest-gold-foreground',
  harvested: 'bg-accent text-accent-foreground',
};

const Crops = () => {
  const { crops, spaces, harvests, addCrop, addHarvest, removeCrop } = useGarden();
  const [cropOpen, setCropOpen] = useState(false);
  const [harvestOpen, setHarvestOpen] = useState(false);

  // Crop form
  const [cropName, setCropName] = useState('');
  const [variety, setVariety] = useState('');
  const [spaceId, setSpaceId] = useState('');
  const [plantedDate, setPlantedDate] = useState('');
  const [expectedHarvest, setExpectedHarvest] = useState('');

  // Harvest form
  const [hCropId, setHCropId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('lbs');
  const [quality, setQuality] = useState<Harvest['quality']>('good');

  const handleAddCrop = () => {
    if (!cropName.trim() || !spaceId) return;
    addCrop({
      id: Date.now().toString(),
      name: cropName.trim(),
      variety: variety.trim(),
      spaceId,
      plantedDate,
      expectedHarvest,
      status: 'planted',
      notes: '',
      qrData: `CROP-${Date.now()}-${cropName.toUpperCase()}`,
    });
    setCropName(''); setVariety(''); setSpaceId(''); setPlantedDate(''); setExpectedHarvest('');
    setCropOpen(false);
  };

  const handleAddHarvest = () => {
    if (!hCropId || !quantity) return;
    const crop = crops.find(c => c.id === hCropId);
    const space = spaces.find(s => s.id === crop?.spaceId);
    addHarvest({
      id: Date.now().toString(),
      cropId: hCropId,
      cropName: crop?.name || '',
      spaceName: space?.name || '',
      quantity: parseFloat(quantity),
      unit,
      harvestDate: new Date().toISOString().split('T')[0],
      quality,
      notes: '',
    });
    setHCropId(''); setQuantity(''); setUnit('lbs'); setQuality('good');
    setHarvestOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Crops & Harvests</h1>
          <p className="mt-1 text-muted-foreground">Track your garden produce</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={harvestOpen} onOpenChange={setHarvestOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2"><Plus className="h-4 w-4" /> Log Harvest</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Log a Harvest</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <Select value={hCropId} onValueChange={setHCropId}>
                  <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
                  <SelectContent>
                    {crops.filter(c => c.status !== 'harvested').map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name} ({c.variety})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Input placeholder="Quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} />
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lbs">lbs</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="pieces">pcs</SelectItem>
                      <SelectItem value="bunches">bunches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Select value={quality} onValueChange={v => setQuality(v as Harvest['quality'])}>
                  <SelectTrigger><SelectValue placeholder="Quality" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddHarvest} className="w-full">Record Harvest</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={cropOpen} onOpenChange={setCropOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> Add Crop</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Crop</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <Input placeholder="Crop name" value={cropName} onChange={e => setCropName(e.target.value)} />
                <Input placeholder="Variety" value={variety} onChange={e => setVariety(e.target.value)} />
                <Select value={spaceId} onValueChange={setSpaceId}>
                  <SelectTrigger><SelectValue placeholder="Select space" /></SelectTrigger>
                  <SelectContent>
                    {spaces.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="date" placeholder="Planted date" value={plantedDate} onChange={e => setPlantedDate(e.target.value)} />
                <Input type="date" placeholder="Expected harvest" value={expectedHarvest} onChange={e => setExpectedHarvest(e.target.value)} />
                <Button onClick={handleAddCrop} className="w-full">Add Crop</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="crops">
        <TabsList className="mb-6">
          <TabsTrigger value="crops">Crops ({crops.length})</TabsTrigger>
          <TabsTrigger value="harvests">Harvests ({harvests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="crops">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {crops.map((crop, i) => {
              const space = spaces.find(s => s.id === crop.spaceId);
              return (
                <motion.div
                  key={crop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="stat-card group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg garden-gradient text-primary-foreground font-bold">
                        <Sprout className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{crop.name}</h3>
                        <p className="text-xs text-muted-foreground">{crop.variety}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusBadge[crop.status]}>{crop.status}</Badge>
                      <button onClick={() => removeCrop(crop.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>📍 {space?.name || 'Unknown'}</p>
                    <p>🌱 Planted: {crop.plantedDate}</p>
                    <p>📅 Expected: {crop.expectedHarvest}</p>
                    {crop.notes && <p className="text-xs mt-2 italic">{crop.notes}</p>}
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground font-mono">QR: {crop.qrData}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="harvests">
          <div className="rounded-xl border bg-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Crop</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Space</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Quantity</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Quality</th>
                </tr>
              </thead>
              <tbody>
                {harvests.map(h => (
                  <tr key={h.id} className="border-b last:border-0">
                    <td className="p-4 font-medium text-foreground">{h.cropName}</td>
                    <td className="p-4 text-muted-foreground">{h.spaceName}</td>
                    <td className="p-4 text-foreground">{h.quantity} {h.unit}</td>
                    <td className="p-4 text-muted-foreground">{h.harvestDate}</td>
                    <td className="p-4"><Badge className={statusBadge[h.quality === 'excellent' ? 'ready' : h.quality === 'good' ? 'growing' : 'planted']}>{h.quality}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Crops;
