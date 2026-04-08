import { useState } from 'react';
import { Bluetooth, BluetoothSearching, Wifi, WifiOff, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface BluetoothScaleInputProps {
  value: string;
  onChange: (value: string) => void;
}

type InputMode = 'select' | 'scanning' | 'connected' | 'manual-mac' | 'manual';

const getNavigatorBluetooth = (): any => {
  return (navigator as any).bluetooth;
};

const BluetoothScaleInput = ({ value, onChange }: BluetoothScaleInputProps) => {
  const [mode, setMode] = useState<InputMode>('select');
  const [scanning, setScanning] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [connectedCharacteristic, setConnectedCharacteristic] = useState<any>(null);

  const isBluetoothSupported = typeof navigator !== 'undefined' && 'bluetooth' in navigator;

  const handleDiscoverScale = async () => {
    const bt = getNavigatorBluetooth();
    if (!bt) {
      toast({ title: 'Bluetooth not supported', description: 'Your browser does not support Web Bluetooth. Try Chrome on desktop or Android.', variant: 'destructive' });
      setMode('manual');
      return;
    }

    setScanning(true);
    setMode('scanning');

    try {
      const device = await bt.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          'weight_scale',
          '0000181d-0000-1000-8000-00805f9b34fb',
          '0000fff0-0000-1000-8000-00805f9b34fb',
          '0000ffe0-0000-1000-8000-00805f9b34fb',
          '0000ffb0-0000-1000-8000-00805f9b34fb',
          'battery_service',
          'device_information',
          'generic_access',
        ],
      });

      setDeviceName(device.name || 'Unknown Scale');
      toast({ title: 'Device found', description: `Connecting to ${device.name || 'scale'}...` });

      const server = await device.gatt?.connect();
      if (!server) throw new Error('Could not connect to GATT server');

      const serviceUUIDs = [
        '0000181d-0000-1000-8000-00805f9b34fb',
        '0000fff0-0000-1000-8000-00805f9b34fb',
      ];

      let foundChar: any = null;

      for (const uuid of serviceUUIDs) {
        try {
          const service = await server.getPrimaryService(uuid);
          const chars = await service.getCharacteristics();
          if (chars.length > 0) {
            foundChar = chars[0];
            break;
          }
        } catch {
          continue;
        }
      }

      if (foundChar) {
        setConnectedCharacteristic(foundChar);
        setMode('connected');

        try {
          await foundChar.startNotifications();
          foundChar.addEventListener('characteristicvaluechanged', (event: any) => {
            const dataView = event.target.value;
            if (dataView) {
              const weight = dataView.getUint16(1, true) / 100;
              onChange(weight.toString());
            }
          });
          toast({ title: 'Scale connected!', description: 'Weight will update automatically.' });
        } catch {
          try {
            const readValue = await foundChar.readValue();
            const weight = readValue.getUint16(1, true) / 100;
            onChange(weight.toString());
            toast({ title: 'Weight read', description: `${weight} kg` });
          } catch {
            toast({ title: 'Connected', description: 'Could not auto-read. Enter weight manually.' });
            setMode('manual');
          }
        }
      } else {
        toast({ title: 'Connected', description: 'No weight service found. Enter weight manually.' });
        setMode('manual');
      }

      device.addEventListener('gattserverdisconnected', () => {
        setMode('select');
        setDeviceName('');
        setConnectedCharacteristic(null);
        toast({ title: 'Scale disconnected' });
      });

    } catch (err: any) {
      if (err?.name === 'NotFoundError') {
        toast({ title: 'No device selected', description: 'You cancelled the device picker.' });
      } else {
        toast({ title: 'Bluetooth error', description: err?.message || 'Could not connect to scale.', variant: 'destructive' });
      }
      setMode('select');
    } finally {
      setScanning(false);
    }
  };

  const handleManualMacConnect = () => {
    if (!macAddress.trim()) {
      toast({ title: 'Enter MAC address', variant: 'destructive' });
      return;
    }
    toast({ title: 'MAC address saved', description: `Noted ${macAddress}. Web Bluetooth cannot connect by MAC directly — enter weight manually.` });
    setMode('manual');
  };

  if (mode === 'select') {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Weight Input Method</p>
        <div className="grid grid-cols-1 gap-2">
          <Button
            type="button"
            variant="outline"
            className="gap-2 justify-start"
            onClick={handleDiscoverScale}
            disabled={!isBluetoothSupported}
          >
            <BluetoothSearching className="h-4 w-4 text-primary" />
            Discover Bluetooth Scale
            {!isBluetoothSupported && <Badge variant="secondary" className="ml-auto text-xs">Not supported</Badge>}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-2 justify-start"
            onClick={() => setMode('manual-mac')}
          >
            <Bluetooth className="h-4 w-4 text-primary" />
            Enter Scale MAC Address
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-2 justify-start"
            onClick={() => setMode('manual')}
          >
            <Keyboard className="h-4 w-4 text-muted-foreground" />
            Manual Input (kg)
          </Button>
        </div>
      </div>
    );
  }

  if (mode === 'scanning') {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
        <BluetoothSearching className="h-5 w-5 text-primary animate-pulse" />
        <span className="text-sm text-muted-foreground">Scanning for Bluetooth scales...</span>
      </div>
    );
  }

  if (mode === 'connected') {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-3 rounded-lg border border-primary/30 bg-primary/5">
          <Wifi className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{deviceName}</span>
          <Badge className="ml-auto bg-primary text-primary-foreground text-xs">Connected</Badge>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Weight (kg)"
            type="number"
            step="0.01"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="flex-1"
          />
          <span className="flex items-center text-sm text-muted-foreground font-medium">kg</span>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={() => { setMode('select'); setConnectedCharacteristic(null); setDeviceName(''); }}>
          <WifiOff className="h-3 w-3 mr-1" /> Disconnect
        </Button>
      </div>
    );
  }

  if (mode === 'manual-mac') {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Enter Scale MAC Address</p>
        <Input
          placeholder="e.g. AA:BB:CC:DD:EE:FF"
          value={macAddress}
          onChange={e => setMacAddress(e.target.value)}
        />
        <div className="flex gap-2">
          <Button type="button" onClick={handleManualMacConnect} className="flex-1 gap-2">
            <Bluetooth className="h-4 w-4" /> Connect
          </Button>
          <Button type="button" variant="ghost" onClick={() => setMode('select')}>Back</Button>
        </div>
      </div>
    );
  }

  // manual mode
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Weight (kg)</p>
        <Button type="button" variant="ghost" size="sm" onClick={() => setMode('select')} className="text-xs h-7">
          <Bluetooth className="h-3 w-3 mr-1" /> Try Scale
        </Button>
      </div>
      <Input
        placeholder="Enter weight in kg"
        type="number"
        step="0.01"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};

export default BluetoothScaleInput;
