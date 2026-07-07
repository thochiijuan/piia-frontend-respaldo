import FilterPanel from "../components/FilterPanel";
import MapView from "../components/MapView";

export default function DashboardPage() {
  return (
    <div className="flex h-full gap-4">

      <FilterPanel isAuthenticated={true} />

      <MapView />

    </div>
  );
}