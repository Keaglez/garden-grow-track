import { Sprout, MapPin, TrendingUp, Users } from 'lucide-react';
import { useGarden } from '@/context/GardenContext';
import StatCard from '@/components/dashboard/StatCard';
import RecentHarvests from '@/components/dashboard/RecentHarvests';
import CropStatusChart from '@/components/dashboard/CropStatusChart';

const Index = () => {
  const { spaces, crops, harvests, users } = useGarden();

  const totalYield = harvests.reduce((sum, h) => sum + h.quantity, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Overview of your garden activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Garden Spaces"
          value={spaces.length}
          subtitle="Active growing areas"
          icon={MapPin}
          colorClass="garden-gradient text-primary-foreground"
          delay={0}
        />
        <StatCard
          title="Active Crops"
          value={crops.filter(c => c.status !== 'harvested').length}
          subtitle={`${crops.length} total crops`}
          icon={Sprout}
          colorClass="bg-accent text-accent-foreground"
          delay={0.1}
        />
        <StatCard
          title="Total Harvest"
          value={`${totalYield} kg`}
          subtitle={`${harvests.length} harvests recorded`}
          icon={TrendingUp}
          colorClass="harvest-gradient text-harvest-gold-foreground"
          delay={0.2}
        />
        <StatCard
          title="Team Members"
          value={users.length}
          subtitle="Managing your garden"
          icon={Users}
          colorClass="bg-water text-water-foreground"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentHarvests />
        </div>
        <CropStatusChart />
      </div>
    </div>
  );
};

export default Index;
