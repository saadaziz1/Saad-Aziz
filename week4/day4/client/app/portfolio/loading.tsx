import Loader from '../../components/Loader';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <Loader size="lg" text="Loading portfolio..." />
    </div>
  );
}