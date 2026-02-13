import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Camera, Search } from 'lucide-react';
import { useGarden } from '@/context/GardenContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Crop } from '@/types/garden';

const Scanner = () => {
  const { crops, spaces, harvests, getCropByQr } = useGarden();
  const [manualCode, setManualCode] = useState('');
  const [foundCrop, setFoundCrop] = useState<Crop | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrRef = useRef<any>(null);

  const handleManualSearch = () => {
    setError('');
    const crop = getCropByQr(manualCode.trim());
    if (crop) {
      setFoundCrop(crop);
    } else {
      setError('No crop found with that QR code');
      setFoundCrop(null);
    }
  };

  const startScanner = async () => {
    setScanning(true);
    setError('');
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const scanner = new Html5Qrcode('qr-reader');
      html5QrRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          const crop = getCropByQr(decodedText);
          if (crop) {
            setFoundCrop(crop);
            setManualCode(decodedText);
          } else {
            setError(`Scanned: ${decodedText} — No matching crop found`);
          }
          scanner.stop().catch(() => {});
          setScanning(false);
        },
        () => {}
      );
    } catch (err) {
      setError('Camera access denied or not available. Use manual entry instead.');
      setScanning(false);
    }
  };

  const stopScanner = () => {
    if (html5QrRef.current) {
      html5QrRef.current.stop().catch(() => {});
      setScanning(false);
    }
  };

  useEffect(() => {
    return () => { stopScanner(); };
  }, []);

  const space = foundCrop ? spaces.find(s => s.id === foundCrop.spaceId) : null;
  const cropHarvests = foundCrop ? harvests.filter(h => h.cropId === foundCrop.id) : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">QR Scanner</h1>
        <p className="mt-1 text-muted-foreground">Scan crop QR codes for detailed information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Camera Scanner */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" /> Camera Scanner
            </h3>
            <div id="qr-reader" className="rounded-lg overflow-hidden bg-muted mb-4" style={{ minHeight: scanning ? 300 : 0 }} />
            {!scanning ? (
              <Button onClick={startScanner} className="w-full gap-2">
                <QrCode className="h-4 w-4" /> Start Scanning
              </Button>
            ) : (
              <Button onClick={stopScanner} variant="outline" className="w-full">Stop Scanner</Button>
            )}
          </div>

          {/* Manual Entry */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" /> Manual Lookup
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter QR code (e.g., CROP-001-TOMATO-ROMA)"
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleManualSearch()}
              />
              <Button onClick={handleManualSearch}>Search</Button>
            </div>
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">Available QR codes for testing:</p>
              <div className="flex flex-wrap gap-2">
                {crops.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setManualCode(c.qrData); setFoundCrop(c); setError(''); }}
                    className="text-xs font-mono px-2 py-1 rounded bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {c.qrData}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Crop Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {foundCrop ? (
            <div className="rounded-xl border bg-card p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl garden-gradient text-2xl font-bold text-primary-foreground">
                  🌱
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{foundCrop.name}</h2>
                  <p className="text-muted-foreground">{foundCrop.variety}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge className="mt-1 bg-primary text-primary-foreground capitalize">{foundCrop.status}</Badge>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="mt-1 font-medium text-foreground">{space?.name || 'Unknown'}</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-xs text-muted-foreground">Planted</p>
                  <p className="mt-1 font-medium text-foreground">{foundCrop.plantedDate}</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-xs text-muted-foreground">Expected Harvest</p>
                  <p className="mt-1 font-medium text-foreground">{foundCrop.expectedHarvest}</p>
                </div>
              </div>

              {foundCrop.notes && (
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm text-foreground">{foundCrop.notes}</p>
                </div>
              )}

              {cropHarvests.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Harvest History</h3>
                  <div className="space-y-2">
                    {cropHarvests.map(h => (
                      <div key={h.id} className="flex items-center justify-between rounded-lg border p-3">
                        <span className="text-sm text-foreground">{h.harvestDate}</span>
                        <span className="font-medium text-foreground">{h.quantity} {h.unit}</span>
                        <Badge variant="outline" className="capitalize">{h.quality}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-12 text-center">
              <QrCode className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No Crop Selected</h3>
              <p className="text-sm text-muted-foreground mt-1">Scan a QR code or use manual lookup to view crop details</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Scanner;
