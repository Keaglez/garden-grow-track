import { useState, useRef } from 'react';
import { Plus, ImagePlus, ShoppingBasket, Sprout, Package, Trash2, Tag, PercentCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGarden } from '@/context/GardenContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import type { ShopCategory, ShopStatus, ShopItem } from '@/types/garden';

const categoryIcons: Record<ShopCategory, React.ElementType> = {
  produce: ShoppingBasket,
  seedlings: Sprout,
  inputs: Package,
};

const statusConfig: Record<ShopStatus, { label: string; className: string }> = {
  'in-stock': { label: 'In Stock', className: 'bg-primary text-primary-foreground' },
  'sale': { label: 'Sale', className: 'bg-harvest-gold text-harvest-gold-foreground' },
  'out-of-stock': { label: 'Out of Stock', className: 'bg-destructive text-destructive-foreground' },
};

const Shop = () => {
  const { shopItems, addShopItem, removeShopItem, updateShopItemStatus } = useGarden();
  const [addOpen, setAddOpen] = useState(false);
  const [statusDialogItem, setStatusDialogItem] = useState<ShopItem | null>(null);

  // Add form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ShopCategory>('produce');
  const [price, setPrice] = useState('');
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status change form
  const [newStatus, setNewStatus] = useState<ShopStatus>('in-stock');
  const [salePercent, setSalePercent] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleAdd = () => {
    if (!name.trim() || !price) return;
    addShopItem({
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      category,
      price: parseFloat(price),
      currency: 'USD',
      status: 'in-stock',
      imageUrl: imagePreview,
      createdAt: new Date().toISOString().split('T')[0],
    });
    setName(''); setDescription(''); setCategory('produce'); setPrice(''); setImagePreview(undefined);
    setAddOpen(false);
  };

  const handleStatusChange = () => {
    if (!statusDialogItem) return;
    updateShopItemStatus(statusDialogItem.id, newStatus, newStatus === 'sale' ? parseFloat(salePercent) || 10 : undefined);
    setStatusDialogItem(null);
  };

  const openStatusDialog = (item: ShopItem) => {
    setStatusDialogItem(item);
    setNewStatus(item.status);
    setSalePercent(item.salePercent?.toString() || '10');
  };

  const filterByCategory = (cat: ShopCategory) => shopItems.filter(i => i.category === cat);

  const renderItem = (item: ShopItem, index: number) => {
    const Icon = categoryIcons[item.category];
    const sc = statusConfig[item.status];
    const salePrice = item.status === 'sale' && item.salePercent
      ? item.price * (1 - item.salePercent / 100)
      : null;

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card className="card-hover overflow-hidden">
          {item.imageUrl && (
            <div className="h-36 overflow-hidden">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            </div>
          )}
          {!item.imageUrl && (
            <div className="h-36 flex items-center justify-center bg-muted">
              <Icon className="h-12 w-12 text-muted-foreground/40" />
            </div>
          )}
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{item.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
              </div>
              <Badge className={sc.className}>{sc.label}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                {salePrice !== null ? (
                  <>
                    <span className="text-lg font-bold text-foreground">${salePrice.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground line-through">${item.price.toFixed(2)}</span>
                    <Badge variant="secondary" className="text-xs">-{item.salePercent}%</Badge>
                  </>
                ) : (
                  <span className="text-lg font-bold text-foreground">${item.price.toFixed(2)}</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => openStatusDialog(item)}>
                <Tag className="h-3 w-3" /> Status
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => removeShopItem(item.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Shop</h1>
          <p className="mt-1 text-muted-foreground">Sell your produce, seedlings & inputs</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Shop Item</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <Input placeholder="Item name" value={name} onChange={e => setName(e.target.value)} />
              <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="resize-none" rows={2} />
              <Select value={category} onValueChange={v => setCategory(v as ShopCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="produce">Produce</SelectItem>
                  <SelectItem value="seedlings">Seedlings</SelectItem>
                  <SelectItem value="inputs">Inputs</SelectItem>
                </SelectContent>
              </Select>
              <Input type="number" placeholder="Price (USD)" value={price} onChange={e => setPrice(e.target.value)} min="0" step="0.01" />
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                    <Button type="button" variant="secondary" size="sm" className="absolute bottom-2 right-2" onClick={() => fileInputRef.current?.click()}>Change</Button>
                  </div>
                ) : (
                  <Button type="button" variant="outline" className="w-full gap-2" onClick={() => fileInputRef.current?.click()}>
                    <ImagePlus className="h-4 w-4" /> Add Image
                  </Button>
                )}
              </div>
              <Button onClick={handleAdd} className="w-full">Add to Shop</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status change dialog */}
      <Dialog open={!!statusDialogItem} onOpenChange={open => !open && setStatusDialogItem(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Change Status — {statusDialogItem?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <Select value={newStatus} onValueChange={v => setNewStatus(v as ShopStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
            {newStatus === 'sale' && (
              <div className="flex items-center gap-2">
                <PercentCircle className="h-4 w-4 text-muted-foreground" />
                <Input type="number" placeholder="Discount %" value={salePercent} onChange={e => setSalePercent(e.target.value)} min="1" max="99" className="flex-1" />
              </div>
            )}
            <Button onClick={handleStatusChange} className="w-full">Update Status</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All ({shopItems.length})</TabsTrigger>
          <TabsTrigger value="produce">Produce ({filterByCategory('produce').length})</TabsTrigger>
          <TabsTrigger value="seedlings">Seedlings ({filterByCategory('seedlings').length})</TabsTrigger>
          <TabsTrigger value="inputs">Inputs ({filterByCategory('inputs').length})</TabsTrigger>
        </TabsList>

        {(['all', 'produce', 'seedlings', 'inputs'] as const).map(tab => (
          <TabsContent key={tab} value={tab}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {(tab === 'all' ? shopItems : filterByCategory(tab as ShopCategory)).map((item, i) => renderItem(item, i))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Shop;
